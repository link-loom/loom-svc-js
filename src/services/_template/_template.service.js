class TemplateService {
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
    this._tableName = 'MY_TABLE';

    /* Assigments */
    /* this._newPrivateObject = new SomeObject(this._dependencies) */
  }

  async create ({ params }) {
    try {
      if (!params || !params.PROPERTY) {
        return this._utilities.io.response.error('Please provide PROPERTY');
      }

      params.id = this._utilities.generator.id({
        length: 15,
        prefix: 'id_prefix-',
      });

      const entity = new this._models.TemplateModel(params, this._dependencies);
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
        return this._utilities.io.response.error('Please provide a queryselector');
      }

      let response = {};

      switch (params.queryselector) {
        case 'id':
          response = await this.#getById({ params });
          break;
        case 'PROPERTY':
          response = await this.#getByPROPERTY({ params });
          break;
        case 'all':
          response = await this.#getAll({ params });
          break;
        default:
          response = this._utilities.io.response.error('Provide a valid slug to query');
          break;
      }

      return response;
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async delete ({ params }) {
    try {
      if (!params || !params.id) {
        return this._utilities.io.response.error('Please provide an Id');
      }
      const entityResponse = await this.#getById({ search: params.id });

      if (!this._utilities.validator.response(entityResponse)) {
        return entityResponse;
      }

      if (!entityResponse.result?.items?.length) {
        return this._utilities.io.response.error('The provided ID does not match any record');
      }

      const transactionResponse = await this._database.update({
        tableName: this._tableName,
        entity: { id: params.id, status: this.status.deleted },
      });

      if (!transactionResponse) {
        this._console.error(transactionResponse);
        return this._utilities.io.response.error();
      }

      return this._utilities.io.response.success({
        ...params,
        status: this.status.deleted,
      });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async #getById ({ params }) {
    try {
      if (!params || !params.search) {
        return this._utilities.io.response.error('Please provide query to search');
      }

      return this.#getByFilters({
        filters: [{ key: 'id', operator: '==', value: params.search }],
      });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async #getByPROPERTY ({ params }) {
    try {
      if (!params || !params.search) {
        return this._utilities.io.response.error('Please provide query to search');
      }

      return this.#getByFilters({
        filters: [{ key: 'PROPERTY', operator: '==', value: params.search }],
      });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  /**
   * Retrieve entities based on certain filters provided in the 'params' object.
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
      const page = Number(params.page) || 1;
      const pageSize = Number(params.pageSize) || 25;

      return this.#getByFilters({
        filters: [
          { key: 'status.name', operator: 'in', value: params.include_status },
          {
            key: 'status.name',
            operator: 'not-in',
            value: params.exclude_status,
          },
        ],
        page,
        pageSize,
      });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async #getByFilters (params) {
    try {
      if (!params || !params.filters) {
        return this._utilities.io.response.error('Please provide at least one filter');
      }

      const transactionResponse = await this._database.getByFilters({
        ...{ tableName: this._tableName },
        ...params,
      });

      return this._utilities.io.response.success(transactionResponse);
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  get status () {
    return this._models.TemplateModel.statuses;
  }
}

module.exports = TemplateService;
