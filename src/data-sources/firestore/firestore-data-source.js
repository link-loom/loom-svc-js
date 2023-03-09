const firebase = require('firebase-admin')
const DataSource = require('./../base/data-source')

class FirebaseDataSource extends DataSource {
  constructor (dependencies) {
    if (!dependencies) {
      throw new Error('Required args to build this entity')
    }

    super(dependencies)

    /* Base Properties */
    this._dependencies = dependencies
    this._utilities = this._dependencies.utilities
    this._db = this._dependencies.db

    /* Custom Properties */
    this._databaseConnectionObj = this._dependencies.config.FIREBASE_ADMIN || {}
  }

  async setup () {
    this._db.driver.initializeApp({
      credential: this._db.driver.credential.cert(this._databaseConnectionObj)
    })

    // This is the client connection
    this._db.client = this._db.driver.firestore()
    this._db.client.settings({ timestampsInSnapshots: true })
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
        console.log(documentResponse)

        this._utilities.response.error()
      }

      return entity
    } catch (error) {
      console.log(error)

      this._utilities.response.error()
    }
  }

  async update ({ tableName, newEntity, oldEntity }) {
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
          value: newEntity.id
        }]
      })

      if (!entityResponse) {
        return entityResponse
      }

      oldEntity = entityResponse.result[0]

      // "Merging" the new data with the old data
      newEntity = { ...oldEntity, ...newEntity }

      const document = this._db.client.collection(tableName).doc(oldEntity.id)
      const documentResponse = await document.update(newEntity)

      if (!documentResponse) {
        console.error(documentResponse)

        this._utilities.response.error()
      }

      return newEntity
    } catch (error) {
      console.log(error)

      this._utilities.response.error()
    }
  }

  async getByFilters ({ tableName, filters }) {
    try {
      const superResponse = await super.getByFilters()

      if (!this._utilities.response.isValid(superResponse)) {
        return superResponse
      }

      let query = this._db.client.collection(tableName)

      for (const filter of filters) {
        if (filter.key) {
          query = query.where(filter.key || '', filter.operator || '==', filter.value || '')
        }
      }

      // Get values from reference as snapshot
      /* const snapshot = await this._db.collection(tableName)
        .where(key, operator || '==', value)
        .get() */

      const snapshop = await query.get()

      // Cast Firebase object into an arry of devices
      const entityResponse = this.#castArraySnapshot(snapshot)

      return entityResponse.data
    } catch (error) {
      console.log(error)

      this._utilities.response.error()
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