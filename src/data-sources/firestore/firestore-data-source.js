const DataSource = require('./../base/data-source')

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
    this._databaseConnectionObj = this._dependencies.config.DATASOURCE_CONFIGS.FIRESTORE.CONNECTION_OBJ || {}
    this._databaseSettings = this._dependencies.config.DATASOURCE_CONFIGS.FIRESTORE.SETTINGS || {}
  }

  async setup () {
    // Setup the driver/client
    this._db.driver.initializeApp({
      credential: this._db.driver.credential.cert(this._databaseConnectionObj)
    })

    // Create a client and create a new connection
    this._db.client = this._db.driver.firestore()
    this._db.client.settings(this._databaseSettings)
  }

  async create ({ tableName, entity } = {}) {
    try {
      const superResponse = await super.create()

      if (!this._utilities.response.isValid(superResponse)) {
        return superResponse
      }

      const document = this._db.client.collection(tableName).doc(entity.id)
      const documentResponse = await document.set(entity)

      if (!documentResponse) {
        this._utilities.response.error()
      }

      return entity || {}
    } catch (error) {
      this._console.error(error)

      return null
    }
  }

  async update ({ tableName, entity, currentEntity }) {
    try {
      const superResponse = await super.getByFilters()

      if (!this._utilities.response.isValid(superResponse)) {
        return superResponse
      }

      // Getting the original entity
      const entityResponse = await this.getByFilters({
        tableName,
        filters: [{
          key: 'id',
          operator: '==',
          value: entity.id
        }]
      })

      if (!entityResponse) {
        return entityResponse
      }

      currentEntity = entityResponse.result[0]

      // "Merging" the new data with the old data
      entity = { ...currentEntity, ...entity }

      const document = this._db.client.collection(tableName).doc(currentEntity.id)
      const documentResponse = await document.update(entity)

      if (!documentResponse) {
        console.error(documentResponse)

        this._utilities.response.error()
      }

      return entity || {}
    } catch (error) {
      this._console.error(error)

      return null
    }
  }

  async getByFilters ({ tableName, filters }) {
    try {
      const superResponse = await super.getByFilters()

      if (!this._utilities.response.isValid(superResponse)) {
        return superResponse
      }

      let collection = this._db.client.collection(tableName)
      collection = this.#transformFilters(collection, filters)

      const snapshot = await collection.get()

      // Cast Firebase object into an arry of devices
      const entityResponse = this.#castArraySnapshot(snapshot)

      return entityResponse.data || []
    } catch (error) {
      this._console.error(error)

      return []
    }
  }

  #transformFilters (collection, filters) {
    try {
      // Get values from reference as snapshot
      /* const snapshot = await this._db.collection(tableName)
        .where(key, operator || '==', value)
        .get() */
      for (const filter of filters) {
        if (filter.key) {
          collection = collection.where(filter.key || '', filter.operator || '==', filter.value || '')
        }

        return collection
      }
    } catch (error) {
      this._console.error(error)
      return collection
    }

  }

  /**
     * Cast a Firebase snapshot into an array
     * @param {any} snapshot is the snapshop returned by database
     * @returns an array of objects
     */
  #castArraySnapshot (snapshot) {
    if (snapshot) {
      const arr = []
      const obj = {}

      snapshot.docs.forEach(childSnapshot => {
        const item = childSnapshot.data()
        arr.push(item)
      })

      obj.raw = snapshot
      obj.data = arr

      return obj
    } else {
      return null
    }
  }
}

module.exports = FirebaseDataSource