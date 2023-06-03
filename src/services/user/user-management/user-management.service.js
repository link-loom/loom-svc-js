class UserService {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies
    this._db = dependencies.db
    this._models = dependencies.models
    this._utilities = dependencies.utilities
    this._console = this._dependencies.console
    this._services = this._dependencies.services

    /* Custom Properties */
    this._tableName = 'users'

    /* Assigments */
    this._apiManagerService = new this._services.ApiManagerService(this._dependencies)
  }

  async create (data) {
    try {
      if (!data || !data.phone) {
        return this._utilities.io.response.error('Please provide minimum data')
      }

      const entityResponse = await this.#getByFilters({
        filters: [
          { key: 'phone', operator: '==', value: data.phone }
        ]
      })

      if (this._utilities.validator.response(entityResponse) && entityResponse.result.length > 0) {
        return this._utilities.io.response.error('Provided user is already registered', { status: 551 })
      }

      this.#formatCreateEntity(data)

      const entity = new this._models.UserManagement(data, this._dependencies)
      const transactionResponse = await this._db.transaction.create({
        tableName: this._tableName,
        entity: entity.get
      })

      if (!transactionResponse) {
        this._console.error(transactionResponse)
        return this._utilities.io.response.error()
      }

      // Send a confirmation email
      if (!data.is_account_activated) {
        this.#sendConfirmationNotification(data)
      }

      return this._utilities.io.response.success(entity.sanitized)
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

      return this._utilities.io.response.success(transactionResponse)
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
        case 'national-id':
          response = await this.#getByNationalId(data)
          break
        case 'phone':
          response = await this.#getByPhone(data)
          break
        case 'email':
          response = await this.#getByEmail(data)
          break
        case 'business-id':
          response = await this.#getByBusinessId(data)
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

  async #getByNationalId (data) {
    try {
      if (!data || !data.search) {
        return this._utilities.io.response.error('Please provide query to search')
      }

      return this.#getByFilters({
        filters: [
          { key: 'national_id', operator: '==', value: data.search }
        ]
      })
    } catch (error) {
      this._console.error(error)
      return this._utilities.io.response.error()
    }
  }

  async #getByPhone (data) {
    try {
      if (!data || !data.search) {
        return this._utilities.io.response.error('Please provide query to search')
      }

      return this.#getByFilters({
        filters: [
          { key: 'phone', operator: '==', value: data.search }
        ]
      })
    } catch (error) {
      this._console.error(error)
      return this._utilities.io.response.error()
    }
  }

  async #getByEmail (data) {
    try {
      if (!data || !data.search) {
        return this._utilities.io.response.error('Please provide query to search')
      }

      return this.#getByFilters({
        filters: [
          { key: 'email', operator: '==', value: data.search }
        ]
      })
    } catch (error) {
      this._console.error(error)
      return this._utilities.io.response.error()
    }
  }

  async #getByBusinessId (data) {
    try {
      if (!data || !data.search) {
        return this._utilities.io.response.error('Please provide query to search')
      }

      return this.#getByFilters({
        filters: [
          { key: 'business_id', operator: '==', value: data.search }
        ]
      })
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

      const response = await this._db.transaction.getByFilters({
        tableName: this._tableName,
        filters: data.filters
      })

      return this._utilities.io.response.success(response)
    } catch (error) {
      this._console.error(error)
      return this._utilities.io.response.error()
    }
  }

  #formatCreateEntity (data) {
    const timestamp = (new Date()).getTime() + ''
    const timestampKey = this._utilities.encoder.base64.encode('timestamp')
    const serverUri = this._dependencies.config.SERVICES.FRONTEND.URI + this._dependencies.config.MAIL.VALIDATION_PATH
    const emailTokenKey = this._utilities.encoder.base64.encode('token')
    const emailLinkToken = this._utilities.encoder.base64.encode(this._utilities.encoder.crypto.cypherObject(this._apiManagerService.key, { email: data.email }))

    data.id = this._utilities.generator.id({ length: 15, prefix: 'usr-' })
    data.link_email_activation = `${serverUri}?${timestampKey}=${timestamp}&${emailTokenKey}=${emailLinkToken}`
    data.password = this._utilities.generator.hash.fromString(data.password || '')
  }

  async #sendConfirmationNotification (data) {
    const notificationService = new this._services.NotificationService(this._dependencies)

    await notificationService.create({
      to: data.email,
      channels: [notificationService.channels.email.name],
      email: {
        template: notificationService.emailTemplate.confirmEmail,
        mainActionLink: data.confirmEmailLink
      }
    })
  }

  get status () {
    return this._models.UserManagement.statuses
  }

  get role () {
    return this._models.UserManagement.roles
  }
}

module.exports = UserService
