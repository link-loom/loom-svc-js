class DeviceController {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies
    this._db = dependencies.db
    this._models = dependencies.models
    this._utilities = dependencies.utilities
    this._console = this._dependencies.console
    this._controllers = this._dependencies.controllers

    /* Custom Properties */
    /* this._myPrivateProperty = 'Some value' */
    this._tableName = 'devices'

    /* Assigments */
  }

  async create (data) {
    try {
      if (!data || !data.fingerprint) {
        return this._utilities.response.error('Please provide minimum data')
      }

      const entityResponse = await this.getByFilters({
        filters: [
          { key: 'fingerprint', operator: '==', value: data.fingerprint }
        ]
      })

      if (this._utilities.response.isValid(entityResponse) && entityResponse.result.length > 0) {
        return this._utilities.response.error('Provided device is already registered')
      }
      
      this.#formatCreateEntity(data)

      const entity = new this._models.Device(data, this._dependencies)
      const transactionResponse = await this._db.transaction.create({
        tableName: this._tableName,
        entity: entity.get
      })

      if (!transactionResponse) {
        this._console.error(transactionResponse)
        return this._utilities.response.error()
      }

      return this._utilities.response.success(entity.get)
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async update (data) {
    try {
      if (!data || !data.id) {
        return this._utilities.response.error('Please provide an id')
      }

      const transactionResponse = await this._db.transaction.update({
        tableName: this._tableName,
        entity: data
      })

      if (!transactionResponse) {
        this._console.error(transactionResponse)
        return this._utilities.response.error()
      }

      return this._utilities.response.success(data)
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async getByFilters (data) {
    try {
      if (!data || !data.filters) {
        return this._utilities.response.error('Please provide at least one filter')
      }

      const transactionResponse = await this._db.transaction.getByFilters({
        tableName: this._tableName,
        filters: data.filters
      })

      return this._utilities.response.success(transactionResponse)
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async getById (data) {
    try {
      if (!data || !data.search) {
        return this._utilities.response.error('Please provide query to search')
      }

      return this.getByFilters({
        filters: [
          { key: 'id', operator: '==', value: data.search }
        ]
      })
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async getByUserId (data) {
    try {
      if (!data || !data.search) {
        return this._utilities.response.error('Please provide query to search')
      }

      return this.getByFilters({
        filters: [
          { key: 'user_id', operator: '==', value: data.search }
        ]
      })
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async getByFingerprint (data) {
    try {
      if (!data || !data.search) {
        return this._utilities.response.error('Please provide query to search')
      }

      return this.getByFilters({
        filters: [
          { key: 'fingerprint', operator: '==', value: data.search }
        ]
      })
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async getByIdentity (data) {
    try {
      if (!data || !data.search) {
        return this._utilities.response.error('Please provide query to search')
      }

      return this.getByFilters({
        filters: [
          { key: 'identity', operator: '==', value: data.search }
        ]
      })
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  #formatCreateEntity (data) {
    data.id = this._utilities.idGenerator(15, 'device-')
  }

  get status () {
    return this._models.Device.statuses
  }
}

module.exports = DeviceController
