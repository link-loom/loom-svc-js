const DataSource = require('../base/data-source')

class FirebaseDataSource extends DataSource {
  constructor (dependencies) {
    if (!dependencies) {
      throw new Error('Required args to build this entity')
    }

    super(dependencies)

    /* Base Properties */
    this._dependencies = dependencies
    this._console = this._dependencies.console
    this._utilities = this._dependencies.utilities
    this._db = this._dependencies.db

    /* Custom Properties */
    this._dataSourceConfig = this._dependencies.config.DATASOURCE_CONFIGS.FIRESTORE
    this._databaseConnectionObj = this._dataSourceConfig.CONNECTION_OBJ || {}
    this._databaseSettings = this._dataSourceConfig.SETTINGS || {}
  }

  async setup () {
    try {
      // Setup the driver/client
      /* TODO: Implement all database provider configurations */

      // Create a client and create a new connection
      this._db.client = {/* TODO: Save your databse connected client */ }
    } catch (error) {
      this._console.error(error)
    }
  }

  async create ({ tableName, entity } = {}) {
    try {
      const superResponse = await super.create({ tableName, entity })

      if (!this._utilities.validator.response(superResponse)) {
        return superResponse
      }

      /* TODO: Create your own data insertion using this._db.client */

      return entity || {}
    } catch (error) {
      this._console.error(error)

      return null
    }
  }

  async update ({ tableName, entity }) {
    try {
      const superResponse = await super.update({ tableName, entity })

      if (!this._utilities.validator.response(superResponse)) {
        return superResponse
      }

      /* TODO: Create your own data update using this._db.client */

      return entity || {}
    } catch (error) {
      this._console.error(error)

      return null
    }
  }

  async getByFilters ({ tableName, filters }) {
    try {
      const superResponse = await super.getByFilters({ tableName, filters })

      if (!this._utilities.validator.response(superResponse)) {
        return superResponse
      }

      const transformedFilters = this.#transformFilters(filters)

      /* TODO: Create your own data get using this._db.client */

      return []
    } catch (error) {
      this._console.error(error)

      return []
    }
  }

  #transformFilters (collection, filters) {
    try {
      const transformedFilters = {} // [] it depends of your database provider

      /* TODO: Implement all transformations you need to be consistent between your database providers */

      return transformedFilters
    } catch (error) {
      this._console.error(error)
      return collection
    }
  }
}

module.exports = FirebaseDataSource
