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
    this._auth = this._dependencies.auth

    /* Assigments */
    this._backendService = new this._services.BackendService(this._dependencies)
  }

  async create (data) {
    try {
      if (!data || !data.phone) {
        return this._utilities.response.error('Please provide minimum data')
      }

      const entityResponse = await this.getByFilters({
        filters: [
          { key: 'phone', operator: '==', value: data.phone }
        ]
      })

      if (this._utilities.response.isValid(entityResponse) && entityResponse.result.length > 0) {
        return this._utilities.response.error('Provided user is already registered')
      }

      this.#formatCreateEntity(data)

      const entity = new this._models.User(data, this._dependencies)
      const transactionResponse = await this._db.transaction.create({
        tableName: this._tableName,
        entity: entity.get
      })

      if (!transactionResponse) {
        this._console.error(transactionResponse)
        return this._utilities.response.error()
      }

      // Send a confirmation email
      if (!data.is_account_activated) {
        this.#sendConfirmationNotification(data)
      }

      return this._utilities.response.success(entity.sanitized)
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async update (data) {
    try {
      if (!data || !data.identity) {
        return this._utilities.response.error('Please provide an identity')
      }
      
      const transactionResponse = await this._db.transaction.update({
        tableName: this._tableName,
        entity: data
      })

      if (!transactionResponse) {
        this._console.error(transactionResponse)
        return this._utilities.response.error()
      }

      return this._utilities.response.success(transactionResponse)
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  #formatCreateEntity (data) {
    const timestamp = (new Date()).getTime() + ''
    const timestampKey = this._auth.encoder.base64.encode('timestamp')
    const serverUri = this._dependencies.config.SERVICES.FRONTEND.URI + this._dependencies.config.MAIL.VALIDATION_PATH
    const emailTokenKey = this._auth.encoder.base64.encode('token')
    const emailLinkToken = this._auth.encoder.base64.encode(this._auth.crypto.cypherObject(this._backendService.key, { email: data.email }))

    data.id = this._utilities.idGenerator(15, 'usr-')
    data.link_email_activation = `${serverUri}?${timestampKey}=${timestamp}&${emailTokenKey}=${emailLinkToken}`
    data.password = this._auth.hash.stringToHash(data.password || '')
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

  async getByFilters (data) {
    try {
      if (!data || !data.filters) {
        return this._utilities.response.error('Please provide at least one filter')
      }

      const response = this._db.transaction.getByFilters({
        tableName: this._tableName,
        filters
      })

      return this._utilities.response.success(response)
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

  async getByNationalId (data) {
    try {
      if (!data || !data.search) {
        return this._utilities.response.error('Please provide query to search')
      }

      return this.getByFilters({
        filters: [
          { key: 'national_id', operator: '==', value: data.search }
        ]
      })
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async getByPhone (data) {
    try {
      if (!data || !data.search) {
        return this._utilities.response.error('Please provide query to search')
      }

      return this.getByFilters({
        filters: [
          { key: 'phone', operator: '==', value: data.search }
        ]
      })
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async getByEmail (data) {
    try {
      if (!data || !data.search) {
        return this._utilities.response.error('Please provide query to search')
      }

      return this.getByFilters({
        filters: [
          { key: 'email', operator: '==', value: data.search }
        ]
      })
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async getByBusinessId (data) {
    try {
      if (!data || !data.search) {
        return this._utilities.response.error('Please provide query to search')
      }

      return this.getByFilters({
        filters: [
          { key: 'business_id', operator: '==', value: data.search }
        ]
      })
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  get status () {
    return this._models.User.statuses
  }

  get role () {
    return this._models.User.roles
  }
}

module.exports = UserService
