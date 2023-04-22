class DeviceService {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies
    this._db = dependencies.db
    this._models = dependencies.models
    this._utilities = dependencies.utilities
    this._console = this._dependencies.console
    this._services = this._dependencies.services

    /* Custom Properties */
    /* this._myPrivateProperty = 'Some value' */
    this._tableName = 'devices'

    /* Assigments */
  }

  async create (data) {
    try {
      if (!data || !data.fingerprint) {
        return this._utilities.io.response.error('Please provide minimum data')
      }

      const entityResponse = await this.#getByFilters({
        filters: [
          { key: 'fingerprint', operator: '==', value: data.fingerprint }
        ]
      })

      if (this._utilities.validator.response(entityResponse) && entityResponse.result.length > 0) {
        return this._utilities.io.response.error('Provided device is already registered')
      }

      this.#formatCreateEntity(data)

      const entity = new this._models.DeviceManagement(data, this._dependencies)
      const transactionResponse = await this._db.transaction.create({
        tableName: this._tableName,
        entity: entity.get
      })

      if (!transactionResponse) {
        this._console.error(transactionResponse)
        return this._utilities.io.response.error()
      }

      return this._utilities.io.response.success(entity.get)
    } catch (error) {
      this._console.error(error)
      return this._utilities.io.response.error()
    }
  }

  async update (data) {
    try {
      if (!data || !data.id) {
        return this._utilities.io.response.error('Please provide an id')
      }

      const transactionResponse = await this._db.transaction.update({
        tableName: this._tableName,
        entity: data
      })

      if (!transactionResponse) {
        this._console.error(transactionResponse)
        return this._utilities.io.response.error()
      }

      return this._utilities.io.response.success(data)
    } catch (error) {
      this._console.error(error)
      return this._utilities.io.response.error()
    }
  }

  async get (data) {
    try {
      if (!data || !data.queryselector) {
        return this._utilities.io.response.error('Please provide a queryselector')
      }

      let response = {}

      switch (data.queryselector) {
        case 'id':
          response = await this.#getById(data)
          break
        case 'user-id':
          response = await this.#getByUserId(data)
          break
        case 'fingerprint':
          response = await this.#getByFingerprint(data)
          break
        case 'identity':
          response = await this.#getByIdentity(data)
          break
        default:
          response = this._utilities.io.response.error('Provide a valid slug to query')
          break
      }

      return response
    } catch (error) {
      this._console.error(error)
      return this._utilities.io.response.error()
    }
  }

  async #getByFilters (data) {
    try {
      if (!data || !data.filters) {
        return this._utilities.io.response.error('Please provide at least one filter')
      }

      const transactionResponse = await this._db.transaction.getByFilters({
        tableName: this._tableName,
        filters: data.filters
      })

      return this._utilities.io.response.success(transactionResponse)
    } catch (error) {
      this._console.error(error)
      return this._utilities.io.response.error()
    }
  }

  async #getById (data) {
    try {
      if (!data || !data.search) {
        return this._utilities.io.response.error('Please provide query to search')
      }

      return this.#getByFilters({
        filters: [
          { key: 'id', operator: '==', value: data.search }
        ]
      })
    } catch (error) {
      this._console.error(error)
      return this._utilities.io.response.error()
    }
  }

  async #getByUserId (data) {
    try {
      if (!data || !data.search) {
        return this._utilities.io.response.error('Please provide query to search')
      }

      return this.#getByFilters({
        filters: [
          { key: 'user_id', operator: '==', value: data.search }
        ]
      })
    } catch (error) {
      this._console.error(error)
      return this._utilities.io.response.error()
    }
  }

  async #getByFingerprint (data) {
    try {
      if (!data || !data.search) {
        return this._utilities.io.response.error('Please provide query to search')
      }

      return this.#getByFilters({
        filters: [
          { key: 'fingerprint', operator: '==', value: data.search }
        ]
      })
    } catch (error) {
      this._console.error(error)
      return this._utilities.io.response.error()
    }
  }

  async #getByIdentity (data) {
    try {
      if (!data || !data.search) {
        return this._utilities.io.response.error('Please provide query to search')
      }

      return this.#getByFilters({
        filters: [
          { key: 'identity', operator: '==', value: data.search }
        ]
      })
    } catch (error) {
      this._console.error(error)
      return this._utilities.io.response.error()
    }
  }

  #formatCreateEntity (data) {
    data.id = this._utilities.generator.id({ length: 15, prefix: 'device-' })
  }

  get status () {
    return this._models.DeviceManagement.statuses
  }
}

module.exports = DeviceService
