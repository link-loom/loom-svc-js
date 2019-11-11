function userController (dependencies) {
  const _db = dependencies.db
  const _console = dependencies.console
  const _firebase = dependencies.firebaseManager
  const _utilities = dependencies.utilities
  const _auth = dependencies.auth
  const _controllers = dependencies.controllers
  const _models = dependencies.models

  const get = async () => {
    try {
      // Get values from reference as snapshot
      const docRef = _db.collection('users')
      const docRaw = await docRef.get()
      // Cast Firebase object into an arry of users
      const entityResponse = _firebase.cast.array(docRaw)
      const entityCleaned = _utilities.response.clean(entityResponse)

      return _utilities.response.success(entityCleaned.data)
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const getById = async (data) => {
    try {
      if (!data || !data.id) {
        return _utilities.response.error('Please provide an id')
      }

      // Get values from reference as snapshot
      const docRef = _db.collection('users').doc(`${data.id}`)
      const docRaw = await docRef.get()
      // Cast Firebase object into an arry of users
      const entityResponse = _firebase.cast.object(docRaw)

      // Check if exist any data
      if (!docRaw || !docRaw.exists || !entityResponse) {
        return _utilities.response.error('No user found')
      }

      return _utilities.response.success(_utilities.response.clean(entityResponse))
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const getByIdentity = async (data) => {
    try {
      if (!data || !data.identity) {
        return _utilities.response.error('Please provide a phone number, dni or email')
      }

      let userResult = await getByDni({ dni: data.identity })
      if (_utilities.response.isValid(userResult)) {
        return userResult
      }

      userResult = await getByPhone({ phone: data.identity })
      if (_utilities.response.isValid(userResult)) {
        return userResult
      }

      userResult = await getByEmail({ email: data.identity })
      if (_utilities.response.isValid(userResult)) {
        return userResult
      }

      userResult = await getById({ id: data.identity })
      if (_utilities.response.isValid(userResult)) {
        return userResult
      }

      return _utilities.response.error('User not found')
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const getByDni = async (data) => {
    try {
      if (!data || !data.dni) {
        return _utilities.response.error('Please provide a dni')
      }

      // Get values from reference as snapshot
      const docRef = _db.collection('users')
        .where('dni', '==', `${data.dni}`)
      const docRaw = await docRef.get()
      // Cast Firebase object into an arry of users
      const entityResponse = _firebase.cast.array(docRaw)

      // Check if exist any data
      if (!docRaw || !entityResponse || entityResponse.data.length <= 0) {
        return _utilities.response.error('No user found')
      }

      return _utilities.response.success(entityResponse.data[0])
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const getByPhone = async (data) => {
    try {
      if (!data || !data.phone) {
        return _utilities.response.error('Please provide a dni')
      }

      // Get values from reference as snapshot
      const docRef = _db.collection('users')
        .where('phone', '==', `${data.phone}`)
      const docRaw = await docRef.get()
      // Cast Firebase object into an arry of users
      const entityResponse = _firebase.cast.array(docRaw)

      // Check if exist any data
      if (!docRaw || !entityResponse || entityResponse.data.length <= 0) {
        return _utilities.response.error('No user found')
      }

      return _utilities.response.success(entityResponse.data[0])
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const getByEmail = async (data) => {
    try {
      if (!data || !data.email) {
        return _utilities.response.error('Please provide a email')
      }

      // Get values from reference as snapshot
      const docRef = _db.collection('users')
        .where('email', '==', `${data.email}`)
      const docRaw = await docRef.get()
      // Cast Firebase object into an arry of users
      const entityResponse = _firebase.cast.array(docRaw)

      // Check if exist any data
      if (!docRaw || !entityResponse || entityResponse.data.length <= 0) {
        return _utilities.response.error('No user found')
      }

      return _utilities.response.success(entityResponse.data[0])
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const getAllByBusinessId = async (data) => {
    try {
      if (!data || !data.businessId) {
        return _utilities.response.error('Please provide a business_id')
      }

      // Get values from reference as snapshot
      const docRef = _db.collection('users')
        .where('business_id', '==', `${data.businessId}`)
      const docRaw = await docRef.get()
      // Cast Firebase object into an arry of users
      const entityResponse = _firebase.cast.array(docRaw)

      return _utilities.response.success(entityResponse.data)
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const create = async (data) => {
    try {
      if (!data || !data.email) {
        return _utilities.response.error('Please provide minimum data')
      }

      const userResponse = await getByIdentity({ identity: data.phone || data.email || data.dni })
      if (_utilities.response.isValid(userResponse)) {
        return _utilities.response.error('Provided user is already registered')
      }

      data.id = _utilities.idGenerator(15, 'usr-')
      const timestamp = (new Date()).getTime() + ''
      const docRef = _db.collection('users').doc(data.id)
      const timestampKey = _auth.encoder.base64.encode('timestamp')
      const serverUri = dependencies.config.FRONTEND_URI + dependencies.config.MAIL.VALIDATION_PATH
      const emailTokenKey = _auth.encoder.base64.encode('token')
      const emailLinkToken = _auth.encoder.base64.encode(_auth.crypto.cypherObject(_controllers.backend.getKey(), { email: data.email }))
      data.confirmEmailLink = `${serverUri}?${timestampKey}=${timestamp}&${emailTokenKey}=${emailLinkToken}`
      data.password = _auth.hash.stringToHash(data.password || '')

      const entity = new _models.User(data, dependencies)
      const docResponse = await docRef.set(entity.get)

      if (!docResponse) {
        _console.error(docResponse)
        return _utilities.response.error()
      }

      // Send a confirmation email
      if (data.is_account_activated) {
        _controllers.notification.create({
          to: data.email,
          notification_type: _controllers.notification.notification_type.email,
          email: {
            template: _controllers.notification.email_template.confirmEmail,
            mainActionLink: data.confirmEmailLink
          }
        })
      }

      return _utilities.response.success(entity.sanitized)
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const update = async (data) => {
    try {
      if (!data || !data.identity) {
        return _utilities.response.error('Please provide an identity')
      }
      const entityResponse = await getByIdentity(data)

      if (!_utilities.response.isValid(entityResponse)) {
        return entityResponse
      }

      const docRef = _db.collection('users').doc(entityResponse.result.id)
      const entity = new _models.User({ ...entityResponse.result, ...data }, dependencies)
      const docResponse = await docRef.update(entity.get)

      if (!docResponse) {
        _console.error(docResponse)
        return _utilities.response.error()
      }

      return _utilities.response.success(data)
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  return {
    getAll: get,
    getById,
    getByDni,
    getByEmail,
    getByPhone,
    getByIdentity,
    getAllByBusinessId,
    create,
    update,
    status: _models.User.statuses,
    role: _models.User.roles
  }
}

module.exports = userController
