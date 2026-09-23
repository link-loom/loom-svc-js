class CatalogProductService {
  constructor(dependencies) {
    /* Base Properties */
    this._dependencies = dependencies;
    this._database = this._dependencies?.database?.default?.adapter;
    this._models = dependencies.models;
    this._utilities = dependencies.utilities;
    this._console = this._dependencies.console;
    this._services = this._dependencies.services;

    /* Custom Properties */
    this._tableName = 'product';
    this._databaseName = 'catalog';
  }

  async create({ params, principal }) {
    try {
      if (!params || !params.name || !params.sku) {
        return this._utilities.io.response.error('Please provide name and sku');
      }

      params.id = this._utilities.generator.id({ length: 15, prefix: 'prd-' });
      params.metadata = {
        ...(params.metadata || {}),
        created_by: principal?.subject || null,
      };

      const entity = new this._models.CatalogProductModel(
        params,
        this._dependencies,
      );
      const transactionResponse = await this._database.create({
        tableName: this._tableName,
        databaseName: this._databaseName,
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

  async get({ params }) {
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
        case 'sku':
          response = await this.#getBySku({ params });
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

  async #getById({ params }) {
    if (!params?.search) {
      return this._utilities.io.response.error(
        'Please provide query to search',
      );
    }

    return this.#getByFilters({
      filters: [{ key: 'id', operator: '==', value: params.search }],
    });
  }

  async #getBySku({ params }) {
    if (!params?.search) {
      return this._utilities.io.response.error(
        'Please provide query to search',
      );
    }

    return this.#getByFilters({
      filters: [{ key: 'sku', operator: '==', value: params.search }],
    });
  }

  async #getAll({ params }) {
    return this.#getByFilters({
      filters: [
        { key: 'status.name', operator: 'in', value: params.include_status },
        {
          key: 'status.name',
          operator: 'not-in',
          value: params.exclude_status,
        },
      ],
      page: Number(params.page) || 1,
      pageSize: Number(params.pageSize) || 25,
    });
  }

  async #getByFilters(params) {
    try {
      const transactionResponse = await this._database.getByFilters({
        tableName: this._tableName,
        databaseName: this._databaseName,
        ...params,
      });

      return this._utilities.io.response.success(transactionResponse);
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  get status() {
    return this._models.CatalogProductModel.statuses;
  }
}

module.exports = CatalogProductService;
