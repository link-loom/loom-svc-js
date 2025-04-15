const DataSource = require('../base/data-source');

class TemplateDataSource extends DataSource {
  constructor (dependencies) {
    if (!dependencies) {
      throw new Error('Required args to build this entity');
    }

    super(dependencies);

    /* Base Properties */
    this._dependencies = dependencies;
    this._console = this._dependencies.console;
    this._utilities = this._dependencies.utilities;

    /* Custom Properties */
    this._driver = null;
    this._settings = null;
    this._namespace = '[Loom]::[Database]::[TemplateDB]';
  }

  async setup({ settings }) {
    try {
      if (!settings) {
        throw new Error('TemplateDB configuration missing');
      }

      this._settings = settings || {};

      const { connection, ...options } = this._settings;

      this._driver = {/* TODO: Your configuration */};

      await this._driver.connect();

      this._console.success('Client initialized', { namespace: this._namespace });

      return this._driver;
    } catch (error) {
      this._console.error('Error setting up Module', { namespace: this._namespace });
      console.error(error);
    }
  }

  async create ({ tableName, entity } = {}) {
    try {
      const superResponse = await super.create({ tableName, entity });

      if (!this._utilities.validator.response(superResponse)) {
        return superResponse;
      }

      /* TODO: Create your own data insertion  */

      return entity || {};
    } catch (error) {
      this._console.error(error);

      return null;
    }
  }

  async update ({ tableName, entity }) {
    try {
      const superResponse = await super.update({ tableName, entity });

      if (!this._utilities.validator.response(superResponse)) {
        return superResponse;
      }

      /* TODO: Create your own data update  */

      return entity || {};
    } catch (error) {
      this._console.error(error);

      return null;
    }
  }

  async getByFilters ({ tableName, filters }) {
    try {
      const superResponse = await super.getByFilters({ tableName, filters });

      if (!this._utilities.validator.response(superResponse)) {
        return superResponse;
      }

      const transformedFilters = this.#transformFilters(filters);

      /* TODO: Create your own data get  */

      return [];
    } catch (error) {
      this._console.error(error);

      return [];
    }
  }

  #transformFilters (collection, filters) {
    try {
      const transformedFilters = {}; // [] it depends of your database provider

      /* TODO: Implement all transformations you need to be consistent between your database providers */

      return transformedFilters;
    } catch (error) {
      this._console.error(error);
      return collection;
    }
  }
}

module.exports = TemplateDataSource;
