class UserService {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies;
    this._database = this._dependencies?.database?.default?.adapter;
    this._models = dependencies.models;
    this._utilities = dependencies.utilities;
    this._console = this._dependencies.console;
    this._services = this._dependencies.services;

    /* Custom Properties */
    this._tableName = 'users';

    /* Assigments */
    this._apiManagerService = new this._services.ApiManagerService(
      this._dependencies,
    );
  }

  async create ({ params }) {
    try {
      if (!params || !params.phone) {
        return this._utilities.io.response.error('Please provide minimum params');
      }

      const entityResponse = await this.#getByFilters({
        filters: [{ key: 'phone', operator: '==', value: params.phone }],
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

      this.#formatCreateEntity(params);

      const entity = new this._models.UserManagementModel(params, this._dependencies);
      const transactionResponse = await this._database.create({
        tableName: this._tableName,
        entity: entity.get,
      });

      if (!transactionResponse) {
        this._console.error(transactionResponse);
        return this._utilities.io.response.error();
      }

      // Send a confirmation email
      if (!params.is_account_activated) {
        this.#sendConfirmationNotification(params);
      }

      return this._utilities.io.response.success(entity.sanitized);
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async update ({ params }) {
    try {
      if (!params || !params.id) {
        return this._utilities.io.response.error('Please provide an id');
      }

      const transactionResponse = await this._database.update({
        tableName: this._tableName,
        entity: params,
      });

      if (!transactionResponse) {
        this._console.error(transactionResponse);
        return this._utilities.io.response.error();
      }

      return this._utilities.io.response.success(transactionResponse);
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async get ({ params }) {
    try {
      if (!params || !params.queryselector) {
        return this._utilities.io.response.error(
          'Please provide a queryselector',
        );
      }

      let response = {};

      switch (params.queryselector) {
        case 'id':
          response = await this.#getById({ params });
          break;
        case 'national-id':
          response = await this.#getByNationalId({ params });
          break;
        case 'phone':
          response = await this.#getByPhone({ params });
          break;
        case 'email':
          response = await this.#getByEmail({ params });
          break;
        case 'business-id':
          response = await this.#getByBusinessId({ params });
          break;
        case 'all':
          response = await this.#getAll({ params });
          break;
        default:
          response = this._utilities.io.response.error(
            'Provide a valid slug to query',
          );
          break;
      }

      return response;
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  /**
   * Retrieve entities based on certain filters provided in the `params` object.
   *
   * @param {object} params - The params object containing filters and pagination details.
   * @property {string} params.include_status - An string of status names to be included separated by comma.
   * @property {string} params.exclude_status - An string of status names to be excluded separated by comma.
   * @property {number} params.skip - Number of records to skip for pagination.
   * @property {number} params.limit - Maximum number of records to return.
   * @returns {Array<object>} The array of found entities based on the given filters.
   * @throws Will throw and log an error if there's an issue retrieving the entities.
   */
  async #getAll ({ params }) {
    try {
      const result = await this.#getByFilters({
        filters: [
          {
            key: 'status.name',
            operator: 'in',
            value: params.include_status,
          },
          {
            key: 'status.name',
            operator: 'not-in',
            value: params.exclude_status,
          },
          {
            key: 'skip',
            operator: '==',
            value: params.skip,
          },
          {
            key: 'limit',
            operator: '==',
            value: params.limit,
          },
        ],
      });

      return result;
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async #getById ({ params }) {
    try {
      if (!params || !params.search) {
        return this._utilities.io.response.error(
          'Please provide query to search',
        );
      }

      return this.#getByFilters({
        filters: [{ key: 'id', operator: '==', value: params.search }],
      });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async #getByNationalId ({ params }) {
    try {
      if (!params || !params.search) {
        return this._utilities.io.response.error(
          'Please provide query to search',
        );
      }

      return this.#getByFilters({
        filters: [{ key: 'national_id', operator: '==', value: params.search }],
      });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async #getByPhone ({ params }) {
    try {
      if (!params || !params.search) {
        return this._utilities.io.response.error(
          'Please provide query to search',
        );
      }

      return this.#getByFilters({
        filters: [{ key: 'phone', operator: '==', value: params.search }],
      });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async #getByEmail ({ params }) {
    try {
      if (!params || !params.search) {
        return this._utilities.io.response.error(
          'Please provide query to search',
        );
      }

      return this.#getByFilters({
        filters: [{ key: 'email', operator: '==', value: params.search }],
      });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async #getByBusinessId ({ params }) {
    try {
      if (!params || !params.search) {
        return this._utilities.io.response.error(
          'Please provide query to search',
        );
      }

      return this.#getByFilters({
        filters: [{ key: 'business_id', operator: '==', value: params.search }],
      });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async #getByFilters (params) {
    try {
      if (!params || !params.filters) {
        return this._utilities.io.response.error(
          'Please provide at least one filter',
        );
      }

      const response = await this._database.getByFilters({
        tableName: this._tableName,
        filters: params.filters,
      });

      return this._utilities.io.response.success(response);
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  #formatCreateEntity (params) {
    const timestamp = new Date().getTime() + '';
    const timestampKey = this._utilities.encoder.base64.encode('timestamp');
    const serverUri =
      this._dependencies?.config?.services?.frontend?.uri +
      this._dependencies?.config?.modules?.email?.validateEmail?.path;
    const emailTokenKey = this._utilities.encoder.base64.encode('token');
    const emailLinkToken = this._utilities.encoder.base64.encode(
      this._utilities.encoder.crypto.cypherObject(this._apiManagerService.key, {
        email: params.email,
      }),
    );

    params.id = this._utilities.generator.id({ length: 15, prefix: 'usr-' });
    params.link_email_activation = `${serverUri}?${timestampKey}=${timestamp}&${emailTokenKey}=${emailLinkToken}`;
    params.password = this._utilities.generator.hash.fromString(
      params.password || '',
    );
  }

  async #sendConfirmationNotification (params) {
    const notificationService = new this._services.NotificationService(
      this._dependencies,
    );

    await notificationService.create({
      to: params.email,
      channels: [notificationService.channels.email.name],
      email: {
        template: notificationService.emailTemplate.confirmEmail,
        mainActionLink: params.confirmEmailLink,
      },
    });
  }

  get status () {
    return this._models.UserManagementModel.statuses;
  }

  get role () {
    return this._models.UserManagementModel.roles;
  }
}

module.exports = UserService;
