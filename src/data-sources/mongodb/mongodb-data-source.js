const DataSource = require('./../base/data-source')

class MongoDBDataSource extends DataSource {
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
    this._dataSourceConfig = this._dependencies.config.DATASOURCE_CONFIGS.MONGODB
    this._databaseConnectionObj = this._dataSourceConfig.CONNECTION_OBJ || {}
    this._databaseSettings = this._dataSourceConfig.SETTINGS || {}
  }

  async setup () {
    try {
      // Setup the driver/client
      const settings = this._databaseSettings
      settings.serverApi = this._db.driver.ServerApiVersion.v1

      // Create a client and create a new connection
      this.mongoClient = new this._db.driver.MongoClient(this._databaseConnectionObj, settings)
      this._db.client = await this.mongoClient.connect()
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

      const collection = this._db.client.db(this._databaseSettings.dbName).collection(tableName)
      const documentResponse = collection.insertOne(entity)

      if (!documentResponse) {
        this._utilities.io.response.error()
      }

      return documentResponse || {}
    } catch (error) {
      this._console.error(error)

      return null
    }
  }

  async update ({ tableName, entity } = {}) {
    try {
      const superResponse = await super.update({ tableName, entity })

      if (!this._utilities.validator.response(superResponse)) {
        return superResponse
      }

      const query = { id: entity.id }
      const contract = { $set: entity }
      const collection = this._db.client.db(this._databaseSettings.dbName).collection(tableName)

      const documentResponse = await collection.updateOne(query, contract)

      return documentResponse || {}
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
      const collection = this._db.client.db(this._databaseSettings.dbName).collection(tableName)
      let entityResponse = {}

      entityResponse = await collection.find(transformedFilters || {}).toArray()

      return entityResponse || []
    } catch (error) {
      this._console.error(error)

      return []
    }
  }

  #transformFilters (filters) {
    try {
      const transformedFilters = {}

      if (filters && filters.length > 1) {
        transformedFilters['$and'] = []

        for (const filter of filters) {
          if (filter.key) {
            transformedFilters['$and'].push({
              [filter.key]: filter.value
            })
          }
        }
      } else if (filters && filters.length === 1) {
        const filter = filters[0]
        transformedFilters[filter.key] = filter.value
      }

      return transformedFilters
    } catch (error) {
      this._console.error(error)

      return {}
    }
  }
}

module.exports = MongoDBDataSource
