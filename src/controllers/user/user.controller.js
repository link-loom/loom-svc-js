class UserController {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies
    this._db = dependencies.db
    this._models = dependencies.models
    this._utilities = dependencies.utilities
    this._console = this._dependencies.console
    this._firebase = dependencies.firebaseManager
    this._controllers = this._dependencies.controllers

    /* Custom Properties */
    this._auth = this._dependencies.auth

    /* Assigments */
    /* this._newPrivateObject = new SomeObject(this._dependencies) */
    this._backendController = new this._controllers.BackendController(this._dependencies)
  }

  async get () {
    try {
      // Get values from reference as snapshot
      const docRef = this._db.collection('users')
      const docRaw = await docRef.get()
      // Cast Firebase object into an arry of users
      const entityResponse = this._firebase.cast.array(docRaw)
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

      // Get values from reference as snapshot
      const docRef = this._db.collection('users').doc(`${data.id}`)
      const docRaw = await docRef.get()
      // Cast Firebase object into an arry of users
      const entityResponse = this._firebase.cast.object(docRaw)

      // Check if exist any data
      if (!docRaw || !docRaw.exists || !entityResponse) {
        return this._utilities.response.error('No user found')
      }

      return this._utilities.response.success(this._utilities.response.clean(entityResponse))
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async getByIdentity (data) {
    try {
      if (!data || !data.identity) {
        return this._utilities.response.error('Please provide a phone number, dni or email')
      }

      let userResult = await this.getByDni({ dni: data.identity })
      if (this._utilities.response.isValid(userResult)) {
        return userResult
      }

      userResult = await this.getByPhone({ phone: data.identity })
      if (this._utilities.response.isValid(userResult)) {
        return userResult
      }

      userResult = await this.getByEmail({ email: data.identity })
      if (this._utilities.response.isValid(userResult)) {
        return userResult
      }

      userResult = await this.getById({ id: data.identity })
      if (this._utilities.response.isValid(userResult)) {
        return userResult
      }

      return this._utilities.response.error('User not found')
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

      // Get values from reference as snapshot
      const docRef = this._db.collection('users')
        .where('dni', '==', `${data.dni}`)
      const docRaw = await docRef.get()
      // Cast Firebase object into an arry of users
      const entityResponse = this._firebase.cast.array(docRaw)

      // Check if exist any data
      if (!docRaw || !entityResponse || entityResponse.data.length <= 0) {
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

      // Get values from reference as snapshot
      const docRef = this._db.collection('users')
        .where('phone', '==', `${data.phone}`)
      const docRaw = await docRef.get()
      // Cast Firebase object into an arry of users
      const entityResponse = this._firebase.cast.array(docRaw)

      // Check if exist any data
      if (!docRaw || !entityResponse || entityResponse.data.length <= 0) {
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

      // Get values from reference as snapshot
      const docRef = this._db.collection('users')
        .where('email', '==', `${data.email}`)
      const docRaw = await docRef.get()
      // Cast Firebase object into an arry of users
      const entityResponse = this._firebase.cast.array(docRaw)

      // Check if exist any data
      if (!docRaw || !entityResponse || entityResponse.data.length <= 0) {
        return this._utilities.response.error('No user found')
      }

      return this._utilities.response.success(entityResponse.data[0])
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async getAllByBusinessId (data) {
    try {
      if (!data || !data.businessId) {
        return this._utilities.response.error('Please provide a business_id')
      }

      // Get values from reference as snapshot
      const docRef = this._db.collection('users')
        .where('business_id', '==', `${data.businessId}`)
      const docRaw = await docRef.get()
      // Cast Firebase object into an arry of users
      const entityResponse = this._firebase.cast.array(docRaw)

      return this._utilities.response.success(entityResponse.data)
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
      const docRef = this._db.collection('users').doc(data.id)
      const timestampKey = this._auth.encoder.base64.encode('timestamp')
      const serverUri = this._dependencies.config.FRONTEND_URI + this._dependencies.config.MAIL.VALIDATION_PATH
      const emailTokenKey = this._auth.encoder.base64.encode('token')
      const emailLinkToken = this._auth.encoder.base64.encode(this._auth.crypto.cypherObject(this._backendController.key, { email: data.email }))
      data.link_email_activation = `${serverUri}?${timestampKey}=${timestamp}&${emailTokenKey}=${emailLinkToken}`
      data.password = this._auth.hash.stringToHash(data.password || '')

      const entity = new this._models.User(data, this._dependencies)
      const docResponse = await docRef.set(entity.get)

      if (!docResponse) {
        this._console.error(docResponse)
        return this._utilities.response.error()
      }

      // Send a confirmation email
      if (data.is_account_activated) {
        const notificationController = new this._controllers.NotificationController(this._dependencies)
        notificationController.create({
          to: data.email,
          notification_type: notificationController.notificationType.email,
          email: {
            template: notificationController.emailTemplate.confirmEmail,
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
      if (!data || !data.identity) {
        return this._utilities.response.error('Please provide an identity')
      }
      const entityResponse = await this.getByIdentity(data)

      if (!this._utilities.response.isValid(entityResponse)) {
        return entityResponse
      }

      const docRef = this._db.collection('users').doc(entityResponse.result.id)
      const entity = new this._models.User({ ...entityResponse.result, ...data }, this._dependencies)
      const docResponse = await docRef.update(entity.get)

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

module.exports = UserController
