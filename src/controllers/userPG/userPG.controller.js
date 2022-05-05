class UserPGController {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies
    this._db = this._dependencies.db
    this._models = this._dependencies.models
    this._utilities = this._dependencies.utilities
    this._console = this._dependencies.console
    this._firebase = this._dependencies.firebaseManager
    this._controllers = this._dependencies.controllers

    /* Custom Properties */
    this._auth = this._dependencies.auth
    this._dal = this._dependencies.dal

    /* Assigments */
    /* this._newPrivateObject = new SomeObject(this._dependencies) */
    this._backendController = new this._controllers.BackendController(this._dependencies)
  }

  async getAll () {
    try {
      const query = this._dal.queryBuilder({
        path: 'QUERIES',
        query: 'READ',
        namespace: this._dependencies.config.POSTGRESQL.default_namespace,
        table: 'user',
        condition: '1=1'
      })
      const entityResponse = this._db.query(query)
      // .query('SELECT * FROM users;')
      const entityCleaned = this._utilities.response.clean(entityResponse)

      return this._utilities.response.success(entityCleaned.data)
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async getById (data) {
    try {
      if (!data || !data.id) {
        return this._utilities.response.error('Please provide an id')
      }

      const query = this._dal.queryBuilder({
        path: 'QUERIES',
        query: 'READ',
        namespace: this._dependencies.config.POSTGRESQL.default_namespace,
        table: 'user',
        condition: 'id=$1'
      })
      const entityResponse = await this._db.query(query, [data.id])

      // Check if exist any data
      if (!entityResponse) {
        return this._utilities.response.error('No user found')
      }

      return this._utilities.response.success(this._utilities.response.clean(entityResponse))
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async getByDni (data) {
    try {
      if (!data || !data.dni) {
        return this._utilities.response.error('Please provide a dni')
      }

      const query = this._dal.queryBuilder({
        path: 'QUERIES',
        query: 'READ',
        namespace: this._dependencies.config.POSTGRESQL.default_namespace,
        table: 'user',
        condition: 'dni=$1'
      })
      const entityResponse = this._db.query(query, [data.dni])

      // Check if exist any data
      if (!entityResponse || entityResponse.data.length <= 0) {
        return this._utilities.response.error('No user found')
      }

      return this._utilities.response.success(entityResponse.data[0])
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async getByPhone (data) {
    try {
      if (!data || !data.phone) {
        return this._utilities.response.error('Please provide a dni')
      }

      const query = this._dal.queryBuilder({
        path: 'QUERIES',
        query: 'READ',
        namespace: this._dependencies.config.POSTGRESQL.default_namespace,
        table: 'user',
        condition: 'phone=$1'
      })
      const entityResponse = this._db.query(query, [data.phone])

      // Check if exist any data
      if (!entityResponse || entityResponse.data.length <= 0) {
        return this._utilities.response.error('No user found')
      }

      return this._utilities.response.success(entityResponse.data[0])
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async getByEmail (data) {
    try {
      if (!data || !data.email) {
        return this._utilities.response.error('Please provide a email')
      }

      const query = this._dal.queryBuilder({
        path: 'QUERIES',
        query: 'READ',
        namespace: this._dependencies.config.POSTGRESQL.default_namespace,
        table: 'user',
        condition: 'email=$1'
      })
      const entityResponse = this._db.query(query, [data.email])

      // Check if exist any data
      if (!entityResponse || entityResponse.data.length <= 0) {
        return this._utilities.response.error('No user found')
      }

      return this._utilities.response.success(entityResponse.data[0])
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async getByIdentity (data) {
    try {
      if (data && data.identity) {
        let userResult = await this.getByDni({ dni: data.identity })

        if (this._utilities.response.isValid(userResult)) {
          return userResult
        } else {
          userResult = await this.getByPhone({ phone: data.identity })

          if (this._utilities.response.isValid(userResult)) {
            return userResult
          } else {
            userResult = await this.getByEmail({ email: data.identity })

            if (this._utilities.response.isValid(userResult)) {
              return userResult
            } else {
              userResult = await this.getById({ id: data.identity })

              if (this._utilities.response.isValid(userResult)) {
                return userResult
              } else {
                return this._utilities.response.error('User not found')
              }
            }
          }
        }
      } else {
        return this._utilities.response.error('Please provide a phone number, dni or email')
      }
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async create (data) {
    try {
      if (!data || !data.email) {
        return this._utilities.response.error('Please provide minimum data')
      }

      const userResponse = await this.getByIdentity({ identity: data.phone || data.email || data.dni })
      if (this._utilities.response.isValid(userResponse)) {
        return this._utilities.response.error('Provided user is already registered')
      }

      data.id = this._utilities.idGenerator(15, 'usr-')
      const timestamp = (new Date()).getTime() + ''
      const timestampKey = this._auth.encoder.base64.encode('timestamp')
      const serverUri = this._dependencies.config.FRONTEND_URI + this._dependencies.config.MAIL.VALIDATION_PATH
      const emailTokenKey = this._auth.encoder.base64.encode('token')
      const emailLinkToken = this._auth.encoder.base64.encode(this._auth.crypto.cypherObject(this._backendController.key, { email: data.email }))
      data.confirmEmailLink = `${serverUri}?${timestampKey}=${timestamp}&${emailTokenKey}=${emailLinkToken}`
      data.password = this._auth.hash.stringToHash(data.password || '')

      const entity = new this._models.User(data, this.dependencies)
      const query = this._dal.queryBuilder({
        path: 'QUERIES',
        query: 'CREATE',
        namespace: this._dependencies.config.POSTGRESQL.default_namespace,
        table: 'user',
        properties: entity.getPropertiesAsCommas,
        values: entity.getPropertiesAsBindings
      })
      const docResponse = this._db
        .query(query, entity.getValuesAsArray)

      if (!docResponse) {
        this._console.error(docResponse)
        return this._utilities.response.error()
      }

      // Send a confirmation email
      if (data.is_account_activated) {
        const notificationController = new this._controllers.NotificationController(this._dependencies)
        notificationController.create({
          to: data.email,
          notification_type: notificationController.notification_type.email,
          email: {
            template: notificationController.email_template.confirmEmail,
            mainActionLink: data.confirmEmailLink
          }
        })
      }

      return this._utilities.response.success(entity.sanitized)
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async update (data) {
    try {
      if (!data || !data.id) {
        return this._utilities.response.error('Please provide an identity')
      }

      const entity = new this._models.User(data, this._dependencies)
      const query = this._dal.queryBuilder({
        path: 'QUERIES',
        query: 'UPDATE',
        namespace: this._dependencies.config.POSTGRESQL.default_namespace,
        table: 'user',
        properties: entity.getPropertiesAsAssignment,
        condition: 'id = $1'
      })
      const docResponse = this._db
        .query(query, entity.get.id)

      if (!docResponse) {
        this._console.error(docResponse)
        return this._utilities.response.error()
      }

      return this._utilities.response.success(data)
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

module.exports = UserPGController
