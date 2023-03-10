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

  async getByFilters (data) {
    try {
      if (!data || !data.filters) {
        return this._utilities.response.error('Please provide at least one filter')
      }

      const transactionResponse = this._db.transaction.getByFilters({
        tableName: this._tableName,
        filters
      })

      return this._utilities.response.success(transactionResponse)
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async create (data) {
    try {
      if (!data || !data.fingerprint) {
        return this._utilities.response.error('Please provide minimum data')
      }

      const entityResponse = await this.getByFilters({
        filters: {
          fingerprint: data.fingerprint
        }
      })

      if (this._utilities.response.isValid(entityResponse) && entityResponse.result.length > 0) {
        return this._utilities.response.error('Provided device is already registered')
      }

      data.id = this._utilities.idGenerator(15, 'devi-')

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
      if (!data || !data.fingerprint) {
        return this._utilities.response.error('Please provide an fingerprint')
      }

      const entityResponse = await this.getByFilters({
        filters: {
          fingerprint: data.fingerprint
        }
      })

      if (!this._utilities.response.isValid(entityResponse)) {
        return entityResponse
      }


      const entity = new this._models.Device({ ...entityResponse.result, ...data }, this._dependencies)
      const transactionResponse = await this._db.transaction.update({
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

  get status () {
    return this._models.Device.statuses
  }
}

module.exports = DeviceController
