class DeviceService {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies;
    this._database = this._dependencies?.database?.default?.adapter;
    this._models = dependencies.models;
    this._utilities = dependencies.utilities;
    this._console = this._dependencies.console;
    this._services = this._dependencies.services;

    /* Custom Properties */
    /* this._myPrivateProperty = 'Some value' */
    this._tableName = 'devices';

    /* Assigments */
  }

  async create ({ params }) {
    try {
      if (!params || !params.fingerprint) {
        return this._utilities.io.response.error('Please provide minimum params');
      }

      const entityResponse = await this.#getByFilters({
        filters: [
          { key: 'fingerprint', operator: '==', value: params.fingerprint },
        ],
      });

      if (
        this._utilities.validator.response(entityResponse) &&
        entityResponse.result.length > 0
      ) {
        return this._utilities.io.response.error(
          'Provided device is already registered',
        );
      }

      this.#formatCreateEntity(params);

      const entity = new this._models.DeviceManagementModel(
        params,
        this._dependencies,
      );
      const transactionResponse = await this._database.create({
        tableName: this._tableName,
        entity: entity.get,
      });

      if (!transactionResponse) {
        this._console.error(transactionResponse);
        return this._utilities.io.response.error();
      }

      return this._utilities.io.response.success(entity.get);
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

      return this._utilities.io.response.success(params);
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
        case 'user-id':
          response = await this.#getByUserId({ params });
          break;
        case 'fingerprint':
          response = await this.#getByFingerprint({ params });
          break;
        case 'identity':
          response = await this.#getByIdentity({ params });
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

  async #getByFilters (params) {
    try {
      if (!params || !params.filters) {
        return this._utilities.io.response.error(
          'Please provide at least one filter',
        );
      }

      const transactionResponse = await this._database.getByFilters({
        tableName: this._tableName,
        filters: params.filters,
      });

      return this._utilities.io.response.success(transactionResponse);
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

  async #getByUserId ({ params }) {
    try {
      if (!params || !params.search) {
        return this._utilities.io.response.error(
          'Please provide query to search',
        );
      }

      return this.#getByFilters({
        filters: [{ key: 'user_id', operator: '==', value: params.search }],
      });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async #getByFingerprint ({ params }) {
    try {
      if (!params || !params.search) {
        return this._utilities.io.response.error(
          'Please provide query to search',
        );
      }

      return this.#getByFilters({
        filters: [{ key: 'fingerprint', operator: '==', value: params.search }],
      });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async #getByIdentity ({ params }) {
    try {
      if (!params || !params.search) {
        return this._utilities.io.response.error(
          'Please provide query to search',
        );
      }

      return this.#getByFilters({
        filters: [{ key: 'identity', operator: '==', value: params.search }],
      });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  #formatCreateEntity (params) {
    params.id = this._utilities.generator.id({ length: 15, prefix: 'device-' });
  }

  get status () {
    return this._models.DeviceManagementModel.statuses;
  }
}

module.exports = DeviceService;
