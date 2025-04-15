class DataSource {
  constructor(dependencies) {
    /* Base Properties */
    this._dependencies = dependencies;
    this._utilities = this._dependencies.utilities;
    this._console = this._dependencies.console;
  }

  async create({ tableName, entity } = {}) {
    if (!tableName) {
      return this._utilities.io.response.error('Valid table name');
    }

    if (!entity) {
      return this._utilities.io.response.error('Provide an entity');
    }

    return this._utilities.io.response.success({
      id: this._utilities.generator.id({ length: 15 }),
    });
  }

  async update({ tableName, entity } = {}) {
    if (!tableName) {
      return this._utilities.io.response.error('Valid table name');
    }

    if (!entity) {
      return this._utilities.io.response.error('Provide an entity');
    }

    return this._utilities.io.response.success('Valid table name');
  }

  async getByFilters({ tableName } = {}) {
    if (!tableName) {
      return this._utilities.io.response.error('Valid table name');
    }

    return this._utilities.io.response.success();
  }

  validateTableName(tableName) {
    if (!tableName) {
      return this._utilities.io.response.error('Provide a table name');
    }

    return this._utilities.io.response.success('Valid table name');
  }
}

module.exports = DataSource;
