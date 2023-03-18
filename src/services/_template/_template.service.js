class TemplateService {
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
    this._tableName = 'MY_TABLE'

    /* Assigments */
    /* this._newPrivateObject = new SomeObject(this._dependencies) */
  }

  async getByFilters (data) {
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

  async create (data) {
    try {
      if (!data || !data.PROPERTY) {
        return this._utilities.io.response.error('Please provide PROPERTY')
      }

      data.id = this._utilities.idGenerator(15, 'id_prefix-')

      const entity = new this._models.Template(data, this._dependencies)
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
      if (!data || !data.PROPERTY) {
        return this._utilities.io.response.error('Please provide PROPERTY')
      }

      const entity = new this._models.Template({ ...entityResponse.result, ...data }, this._dependencies)
      const transactionResponse = await this._db.transaction.update({
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

  get status () {
    return this._models.Template.statuses
  }
}

module.exports = TemplateService
