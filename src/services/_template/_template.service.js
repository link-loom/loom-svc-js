class TemplateService {
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
    /* this._newPrivateObject = new SomeObject(this._dependencies) */
  }

  async create(data) {
    try {
      if (!data || !data.PROPERTY) {
        return this._utilities.io.response.error('Please provide PROPERTY');
      }

      data.id = this._utilities.generator.id({
        length: 15,
        prefix: 'id_prefix-',
      });

      const entity = new this._models.Template(data, this._dependencies);
      const transactionResponse = await this._db.transaction.create({
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

  async update(data) {
    try {
      if (!data || !data.id) {
        return this._utilities.io.response.error('Please provide an id');
      }

      const transactionResponse = await this._db.transaction.update({
        tableName: this._tableName,
        entity: data,
      });

      if (!transactionResponse) {
        this._console.error(transactionResponse);
        return this._utilities.io.response.error();
      }

      return this._utilities.io.response.success(data);
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async get(data) {
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
        case 'PROPERTY':
          response = await this.#getByPROPERTY(data);
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

  async delete(data) {
    try {
      if (!data || !data.id) {
        return this._utilities.io.response.error('Please provide an Id');
      }
      const entityResponse = await this.#getById({ search: data.id });

      if (!this._utilities.validator.response(entityResponse)) {
        return entityResponse;
      }

      if (!entityResponse.result?.matchedItems?.length) {
        return this._utilities.io.response.error(
          'The provided ID does not match any record',
        );
      }

      const transactionResponse = await this._db.transaction.update({
        tableName: this._tableName,
        entity: { id: data.id, status: this.status.deleted },
      });

      if (!transactionResponse) {
        this._console.error(transactionResponse);
        return this._utilities.io.response.error();
      }

      return this._utilities.io.response.success({
        ...data,
        status: this.status.deleted,
      });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async #getById(data) {
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

  async #getByPROPERTY(data) {
    try {
      if (!data || !data.search) {
        return this._utilities.io.response.error(
          'Please provide query to search',
        );
      }

      return this.#getByFilters({
        filters: [{ key: 'PROPERTY', operator: '==', value: data.search }],
      });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  /**
   * Retrieve entities based on certain filters provided in the 'data' object.
   * @param {object} data - The data object containing filters and pagination details.
   * @property {string} data.include_status - An string of status names to be included separated by comma.
   * @property {string} data.exclude_status - An string of status names to be excluded separated by comma.
   * @property {number} data.skip - Number of records to skip for pagination.
   * @property {number} data.limit - Maximum number of records to return.
   * @returns {Array<object>} The array of found entities based on the given filters.
   * @throws Will throw and log an error if there's an issue retrieving the entities.
   */

  async #getAll(data) {
    try {
      return this.#getByFilters({
        filters: [
          { key: 'status.name', operator: 'in', value: data.include_status },
          {
            key: 'status.name',
            operator: 'not-in',
            value: data.exclude_status,
          },
          { key: 'skip', operator: '==', value: +data.skip },
          { key: 'limit', operator: '==', value: +data.limit },
        ],
      });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async #getByFilters(data) {
    try {
      if (!data || !data.filters) {
        return this._utilities.io.response.error(
          'Please provide at least one filter',
        );
      }

      const transactionResponse = await this._db.transaction.getByFilters({
        tableName: this._tableName,
        filters: data.filters,
      });

      return this._utilities.io.response.success(transactionResponse);
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  get status() {
    return this._models.Template.statuses;
  }
}

module.exports = TemplateService;
