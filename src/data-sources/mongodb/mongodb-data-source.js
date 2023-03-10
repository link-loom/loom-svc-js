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
    this._databaseConnectionObj = this._dependencies.config.DATASOURCE_CONFIGS.MONGODB.CONNECTION_OBJ || {}
    this._databaseSettings = this._dependencies.config.DATASOURCE_CONFIGS.MONGODB.SETTINGS || {}
  }

  async setup () {
    // Setup the driver/client
    const settings = this._databaseSettings
    settings.serverApi = this._db.driver.ServerApiVersion.v1

    // Create a client and create a new connection
    this.internaClient = new this._db.driver(this._databaseConnectionObj, settings)
    const connection = await internaClient.connect()
    this._db.client = connection.db(this._databaseSettings.dbName)
  }

  async create ({ tableName, entity } = {}) {
    try {
      const superResponse = await super.create({ tableName, entity })

      if (!this._utilities.response.isValid(superResponse)) {
        return superResponse
      }

      const collection = this._db.client.collection(tableName)
      const documentResponse = collection.insertOne(entity)

      if (!documentResponse) {
        this._utilities.response.error()
      }

      return documentResponse
    } catch (error) {
      this._console.error(error)

      this._utilities.response.error()
    }
  }

  async update ({ tableName, entity } = {}) {
    try {
      const superResponse = await super.update({ tableName, entity })

      if (!this._utilities.response.isValid(superResponse)) {
        return superResponse
      }

      const query = { id: entity.id }
      const contract = { $set: entity }
      const collection = this._db.client.collection(tableName)

      const entityResponse = await collection.updateOne(query, contract)

      return entityResponse
    } catch (error) {
      this._console.error(error)

      this._utilities.response.error()
    }
  }

  async getByFilters ({ tableName, filters }) {
    try {
      const superResponse = await super.getByFilters()

      if (!this._utilities.response.isValid(superResponse)) {
        return superResponse
      }

      const collection = this._db.client.collection(tableName)
      const entityResponse = await collection.find(filters).toArray()

      return entityResponse
    } catch (error) {
      this._console.error(error)

      this._utilities.response.error()
    }
  }

}

module.exports = MongoDBDataSource