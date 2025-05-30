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

  async create (data) {
    try {
      if (!data || !data.phone) {
        return this._utilities.io.response.error('Please provide minimum data');
      }

      const entityResponse = await this.#getByFilters({
        filters: [{ key: 'phone', operator: '==', value: data.phone }],
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

      this.#formatCreateEntity(data);

      const entity = new this._models.UserManagementModel(data, this._dependencies);
      const transactionResponse = await this._database.create({
        tableName: this._tableName,
        entity: entity.get,
      });

      if (!transactionResponse) {
        this._console.error(transactionResponse);
        return this._utilities.io.response.error();
      }

      // Send a confirmation email
      if (!data.is_account_activated) {
        this.#sendConfirmationNotification(data);
      }

      return this._utilities.io.response.success(entity.sanitized);
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async update (data) {
    try {
      if (!data || !data.id) {
        return this._utilities.io.response.error('Please provide an id');
      }

      const transactionResponse = await this._database.update({
        tableName: this._tableName,
        entity: data,
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

  async get (data) {
    try {
      if (!data || !data.queryselector) {
        return this._utilities.io.response.error(
          'Please provide a queryselector',
        );
      }

      let response = {};

      switch (data.queryselector) {
        case 'id':
          response = await this.#getById(data);
          break;
        case 'national-id':
          response = await this.#getByNationalId(data);
          break;
        case 'phone':
          response = await this.#getByPhone(data);
          break;
        case 'email':
          response = await this.#getByEmail(data);
          break;
        case 'business-id':
          response = await this.#getByBusinessId(data);
          break;
        case 'all':
          response = await this.#getAll(data);
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
   * Retrieve entities based on certain filters provided in the `data` object.
   *
   * @param {object} data - The data object containing filters and pagination details.
   * @property {string} data.include_status - An string of status names to be included separated by comma.
   * @property {string} data.exclude_status - An string of status names to be excluded separated by comma.
   * @property {number} data.skip - Number of records to skip for pagination.
   * @property {number} data.limit - Maximum number of records to return.
   * @returns {Array<object>} The array of found entities based on the given filters.
   * @throws Will throw and log an error if there's an issue retrieving the entities.
   */
  async #getAll (data) {
    try {
      const result = await this.#getByFilters({
        filters: [
          {
            key: 'status.name',
            operator: 'in',
            value: data.include_status,
          },
          {
            key: 'status.name',
            operator: 'not-in',
            value: data.exclude_status,
          },
          {
            key: 'skip',
            operator: '==',
            value: data.skip,
          },
          {
            key: 'limit',
            operator: '==',
            value: data.limit,
          },
        ],
      });

      return result;
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async #getById (data) {
    try {
      if (!data || !data.search) {
        return this._utilities.io.response.error(
          'Please provide query to search',
        );
      }

      return this.#getByFilters({
        filters: [{ key: 'id', operator: '==', value: data.search }],
      });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async #getByNationalId (data) {
    try {
      if (!data || !data.search) {
        return this._utilities.io.response.error(
          'Please provide query to search',
        );
      }

      return this.#getByFilters({
        filters: [{ key: 'national_id', operator: '==', value: data.search }],
      });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async #getByPhone (data) {
    try {
      if (!data || !data.search) {
        return this._utilities.io.response.error(
          'Please provide query to search',
        );
      }

      return this.#getByFilters({
        filters: [{ key: 'phone', operator: '==', value: data.search }],
      });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async #getByEmail (data) {
    try {
      if (!data || !data.search) {
        return this._utilities.io.response.error(
          'Please provide query to search',
        );
      }

      return this.#getByFilters({
        filters: [{ key: 'email', operator: '==', value: data.search }],
      });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async #getByBusinessId (data) {
    try {
      if (!data || !data.search) {
        return this._utilities.io.response.error(
          'Please provide query to search',
        );
      }

      return this.#getByFilters({
        filters: [{ key: 'business_id', operator: '==', value: data.search }],
      });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async #getByFilters (data) {
    try {
      if (!data || !data.filters) {
        return this._utilities.io.response.error(
          'Please provide at least one filter',
        );
      }

      const response = await this._database.getByFilters({
        tableName: this._tableName,
        filters: data.filters,
      });

      return this._utilities.io.response.success(response);
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  #formatCreateEntity (data) {
    const timestamp = new Date().getTime() + '';
    const timestampKey = this._utilities.encoder.base64.encode('timestamp');
    const serverUri =
      this._dependencies?.config?.services?.frontend?.uri +
      this._dependencies?.config?.modules?.email?.validateEmail?.path;
    const emailTokenKey = this._utilities.encoder.base64.encode('token');
    const emailLinkToken = this._utilities.encoder.base64.encode(
      this._utilities.encoder.crypto.cypherObject(this._apiManagerService.key, {
        email: data.email,
      }),
    );

    data.id = this._utilities.generator.id({ length: 15, prefix: 'usr-' });
    data.link_email_activation = `${serverUri}?${timestampKey}=${timestamp}&${emailTokenKey}=${emailLinkToken}`;
    data.password = this._utilities.generator.hash.fromString(
      data.password || '',
    );
  }

  async #sendConfirmationNotification (data) {
    const notificationService = new this._services.NotificationService(
      this._dependencies,
    );

    await notificationService.create({
      to: data.email,
      channels: [notificationService.channels.email.name],
      email: {
        template: notificationService.emailTemplate.confirmEmail,
        mainActionLink: data.confirmEmailLink,
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
