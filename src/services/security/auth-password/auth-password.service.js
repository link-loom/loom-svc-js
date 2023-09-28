class SecurityAuthPassword {
  constructor(dependencies) {
    /* Base Properties */
    this._dependencies = dependencies;
    this._db = dependencies.db;
    this._models = dependencies.models;
    this._utilities = dependencies.utilities;
    this._console = this._dependencies.console;
    this._services = this._dependencies.services;

    /* Custom Properties */
    /* this._myPrivateProperty = 'Some value' */
    this._tableName = 'MY_TABLE';

    /* Assigments */
    this._apiManagerService = new this._services.ApiManagerService(
      this._dependencies,
    );
  }

  async signUpPassword(data) {
    if (!data || !data.primary_email_address || !data.password) {
      return this._utilities.io.response.error(
        'Is not possible create account, please provide an email and password',
      );
    }
    const userManagementService = new this._services.UserManagementService(
      this._dependencies,
    );
    const entityResponse = await userManagementService.get({
      queryselector: 'email',
      search: data.primary_email_address,
    });

    if (
      this._utilities.validator.response(entityResponse) &&
      entityResponse.result.length > 0
    ) {
      return this._utilities.io.response.error(
        'Provided user is already registered',
        { status: 551 },
      );
    }

    const userResponse = await userManagementService.create(data);

    return userResponse;
  }

  async signInPassword(data) {
    try {
      if (!data.email || !data.password) {
        return this._utilities.io.response.error(
          'Data provided not match with any registered user',
        );
      }

      if (!data.app_id) {
        return this._utilities.io.response.error(
          'Data provided not match with any registered app',
        );
      }

      const userService = new this._services.UserManagementService(
        this._dependencies,
      );
      const userSecurityService = new this._services.UserSecurityService(
        this._dependencies,
      );
      const userAppService = new this._services.UserAppService(
        this._dependencies,
      );
      const userOrganizationService =
        new this._services.UserOrganizationService(this._dependencies);
      const userDto = await userService.get({
        queryselector: 'email',
        search: data.email,
      });
      const user = userDto?.result?.[0] ?? {};
      const userSecurityDto = await userSecurityService.get({
        queryselector: 'user-id',
        search: user.id,
      });
      const userAppDto = await userAppService.get({
        queryselector: 'user-app-id',
        userId: user.id,
        appId: data.app_id,
      });
      const userOrganizationDto = await userOrganizationService.get({
        queryselector: 'user-id',
        search: user.id,
      });
      const userSecurity = userSecurityDto?.result?.[0] ?? {};
      const userApp = userAppDto?.result?.[0] ?? {};
      const userOrganization = userOrganizationDto?.result ?? [];

      if (
        !this._utilities.validator.response(userDto) ||
        !userDto.result.length
      ) {
        return this._utilities.io.response.error(
          'Data provided not match with any registered app',
          { status: 404 },
        );
      }

      if (
        !this._utilities.validator.response(userSecurityDto) ||
        !userSecurityDto.result.length
      ) {
        return this._utilities.io.response.error(
          'Unauthorized user. After 3 failed attempts your account will be blocked by 24 hours.',
          { status: 404 },
        );
      }

      if (
        !this._utilities.validator.response(userAppDto) ||
        !userAppDto.result.length
      ) {
        return this._utilities.io.response.error(
          'User is not registered in this app, you need to signup',
          { status: 404 },
        );
      }

      const isAuthenticated = await this.#authenticateUser(data, {
        ...user,
        ...userSecurity,
        ...userApp,
      });

      if (!isAuthenticated) {
        return this._utilities.io.response.error(
          'Unauthorized. After 3 failed attempts your account will be blocked by 24 hours.',
          { status: 401 },
        );
      }

      const token = await this.#generateJWTToken({
        user,
        userApp,
        organizations: userOrganization,
      });

      if (!token) {
        return this._utilities.io.response.error('Failed to authenticate', {
          status: 401,
        });
      }

      userService.update({
        last_login: this._utilities.generator.time.timestamp(),
        id: user.id,
      });

      return this._utilities.io.response.success(token);
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async resetPassword(data) {
    try {
      if (!data || !data.email) {
        return this._utilities.io.response.error('Please provide an Email');
      }

      const userService = new this._services.UserManagementService(
        this._dependencies,
      );
      const userResponse = await userService.get({
        queryselector: 'email',
        search: data.email,
      });

      if (
        !this._utilities.validator.response(userResponse) ||
        !userResponse.result.length
      ) {
        return this._utilities.io.response.error(
          'The provided email is not registered',
          { status: 404 },
        );
      }

      const timestamp = new Date().getTime() + '';
      const timestampKey = this._utilities.encoder.base64.encode('timestamp');
      const serverUri =
        this._dependencies.config.SERVICES.FRONTEND.URI +
        this._dependencies.config.EMAIL.ACTIONS.RECOVER_PASSWORD.PATH;
      const emailTokenKey =
        this._utilities.encoder.base64.encode('recover-token');
      const emailLinkToken = this._utilities.encoder.base64.encode(
        this._utilities.encoder.crypto.cypherObject(
          this._apiManagerService.key,
          { email: data.email },
        ),
      );

      // Assing recover link and check if data.appId exists. If it does, append it to the recovery link; otherwise, leave the link unchanged.
      data.link_email_recover_password = `${serverUri}?${timestampKey}=${timestamp}&${emailTokenKey}=${emailLinkToken}`;
      data.link_email_recover_password = data.appId
        ? data.link_email_recover_password + `&appId=${data.appId}`
        : data.link_email_recover_password;

      this.#sendEmailRecoverNotification(data);

      return this._utilities.io.response.success(data);
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async newPassword(data) {
    try {
      if (!data || !data.password) {
        return this._utilities.io.response.error('Please provide a password');
      }

      if (
        !data ||
        !data[this._utilities.encoder.base64.encode('timestamp')] ||
        !data[this._utilities.encoder.base64.encode('recover-token')]
      ) {
        return this._utilities.response.error(
          'Invalid token, copy the entire link from the email',
        );
      }

      const timestamp =
        +data[this._utilities.encoder.base64.encode('timestamp')];
      const hours = Math.floor(
        Math.abs(new Date() - new Date(+timestamp)) / 3.6e6,
      );

      if (
        this._dependencies.config.SECURITY.JWT_TOKEN_LIFETIME_HOURS <= hours
      ) {
        return this._utilities.response.error(
          this._utilities.encoder.crypto.cypherObject(
            this._apiManagerService.key,
            'El token está desactualizado, intente solicitar otro correo electrónico.',
          ),
        );
      }

      // Decode encrypted data
      const decodedToken = this._utilities.encoder.base64.decode(
        data[this._utilities.encoder.base64.encode('recover-token')],
      );
      const decipheredToken = this._utilities.encoder.crypto.decipherObject(
        this._apiManagerService.key,
        decodedToken,
      );

      // If decyphered data is valid
      if (!decipheredToken || !decipheredToken.email) {
        return this._utilities.response.error(
          this._utilities.encoder.crypto.cypherObject(
            this._apiManagerService.key,
            'El token no es válido, intente solicitar otro correo electrónico.',
          ),
        );
      }

      const userService = new this._services.UserManagementService(
        this._dependencies,
      );
      const userSecurityService = new this._services.UserSecurityService(
        this._dependencies,
      );
      const userResponse = await userService.get({
        queryselector: 'email',
        search: decipheredToken.email,
      });
      const user = userResponse?.result?.[0];

      if (!this._utilities.validator.response(userResponse) || !user) {
        return this._utilities.io.response.error('User not found', {
          status: 404,
        });
      }

      const userSecurityResponse = await userSecurityService.get({
        queryselector: 'user-id',
        search: user?.id,
      });

      const userSecurity = userSecurityResponse?.result?.[0];

      if (!this._utilities.validator.response(userResponse) || !userSecurity) {
        return this._utilities.io.response.error('User security not found', {
          status: 404,
        });
      }

      return await userSecurityService.update({
        id: userSecurity?.id,
        password: data.password || '',
      });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async verifyEmail(data) {
    try {
      if (!data || !data.timestamp || !data.token) {
        return this._utilities.io.response.error(
          this._utilities.encoder.crypto.cypherObject(
            this._apiManagerService.key,
            'Token is invalid, please try requesting another email.',
          ),
        );
      }

      /* TODO: verifyEmail */

      return this._utilities.io.response.success('Token is valid');
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async #authenticateUser(data, user) {
    const authenticationResult = this._utilities.validator.hash.isValid({
      receivedPassword: data.password,
      hash: user.password,
    });

    return authenticationResult;
  }

  async #generateJWTToken(payload) {
    const entity = new this._models.UserManagementModel(
      payload.user,
      this._dependencies,
    );
    const sanitizedUser = entity.sanitized;
    const augmentedPayload = {
      ...payload,
      identity: sanitizedUser.id, // Or change by your own ID
      sessionTime: this._dependencies.config.SECURITY.JWT_TOKEN_LIFETIME_HOURS,
    };

    const token = await this._utilities.generator.jwt.token({
      tokenizedData: {
        identity: sanitizedUser.id,
      },
      payload: augmentedPayload,
      settings: {
        secret: this._dependencies.config.SERVER.SECRET,
        expiresIn:
          this._dependencies.config.SECURITY.JWT_TOKEN_LIFETIME_HOURS * 3600,
      },
    });

    return token;
  }

  async #sendEmailRecoverNotification(data) {
    const notificationService = new this._services.NotificationService(
      this._dependencies,
    );

    await notificationService.create({
      to: data.email,
      channels: [notificationService.channels.email.name],
      email: {
        template: notificationService.emailTemplate.recoverPassword,
        mainActionLink: data.link_email_recover_password,
      },
    });
  }
}

module.exports = SecurityAuthPassword;
