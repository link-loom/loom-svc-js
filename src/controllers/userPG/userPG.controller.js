function userController (dependencies) {
  const _db = dependencies.db
  const _console = dependencies.console
  const _utilities = dependencies.utilities
  const _auth = dependencies.auth
  const _controllers = dependencies.controllers
  const _models = dependencies.models
  const _dal = dependencies.dal

  const getAll = async () => {
    try {
      const query = _dal.queryBuilder({
        path: 'QUERIES',
        query: 'READ',
        namespace: dependencies.config.POSTGRESQL.default_namespace,
        table: 'user',
        condition: '1=1'
      })
      const entityResponse = _db
        .query(query)
      // .query('SELECT * FROM users;')
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

      const query = _dal.queryBuilder({
        path: 'QUERIES',
        query: 'READ',
        namespace: dependencies.config.POSTGRESQL.default_namespace,
        table: 'user',
        condition: 'id=$1'
      })
      const entityResponse = await _db.query(query, [data.id])

      // Check if exist any data
      if (!entityResponse) {
        return _utilities.response.error('No user found')
      }

      return _utilities.response.success(_utilities.response.clean(entityResponse))
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

      const query = _dal.queryBuilder({
        path: 'QUERIES',
        query: 'READ',
        namespace: dependencies.config.POSTGRESQL.default_namespace,
        table: 'user',
        condition: 'dni=$1'
      })
      const entityResponse = _db.query(query, [data.dni])

      // Check if exist any data
      if (!entityResponse || entityResponse.data.length <= 0) {
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

      const query = _dal.queryBuilder({
        path: 'QUERIES',
        query: 'READ',
        namespace: dependencies.config.POSTGRESQL.default_namespace,
        table: 'user',
        condition: 'phone=$1'
      })
      const entityResponse = _db.query(query, [data.phone])

      // Check if exist any data
      if (!entityResponse || entityResponse.data.length <= 0) {
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

      const query = _dal.queryBuilder({
        path: 'QUERIES',
        query: 'READ',
        namespace: dependencies.config.POSTGRESQL.default_namespace,
        table: 'user',
        condition: 'email=$1'
      })
      const entityResponse = _db.query(query, [data.email])

      // Check if exist any data
      if (!entityResponse || entityResponse.data.length <= 0) {
        return _utilities.response.error('No user found')
      }

      return _utilities.response.success(entityResponse.data[0])
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const getByIdentity = async (data) => {
    try {
      if (data && data.identity) {
        let userResult = await getByDni({ dni: data.identity })

        if (_utilities.response.isValid(userResult)) {
          return userResult
        } else {
          userResult = await getByPhone({ phone: data.identity })

          if (_utilities.response.isValid(userResult)) {
            return userResult
          } else {
            userResult = await getByEmail({ email: data.identity })

            if (_utilities.response.isValid(userResult)) {
              return userResult
            } else {
              userResult = await getById({ id: data.identity })

              if (_utilities.response.isValid(userResult)) {
                return userResult
              } else {
                return _utilities.response.error('User not found')
              }
            }
          }
        }
      } else {
        return _utilities.response.error('Please provide a phone number, dni or email')
      }
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
      const timestampKey = _auth.encoder.base64.encode('timestamp')
      const serverUri = dependencies.config.FRONTEND_URI + dependencies.config.MAIL.VALIDATION_PATH
      const emailTokenKey = _auth.encoder.base64.encode('token')
      const emailLinkToken = _auth.encoder.base64.encode(_auth.crypto.cypherObject(_controllers.backend.getKey(), { email: data.email }))
      data.confirmEmailLink = `${serverUri}?${timestampKey}=${timestamp}&${emailTokenKey}=${emailLinkToken}`
      data.password = _auth.hash.stringToHash(data.password || '')

      const entity = new _models.User(data, dependencies)
      const query = _dal.queryBuilder({
        path: 'QUERIES',
        query: 'CREATE',
        namespace: dependencies.config.POSTGRESQL.default_namespace,
        table: 'user',
        properties: entity.getPropertiesAsCommas,
        values: entity.getPropertiesAsBindings
      })
      const docResponse = _db
        .query(query, entity.getValuesAsArray)

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
      if (!data || !data.id) {
        return _utilities.response.error('Please provide an identity')
      }

      const entity = new _models.User(data, dependencies)
      const query = _dal.queryBuilder({
        path: 'QUERIES',
        query: 'UPDATE',
        namespace: dependencies.config.POSTGRESQL.default_namespace,
        table: 'user',
        properties: entity.getPropertiesAsAssignment,
        condition: 'id = $1'
      })
      const docResponse = _db
        .query(query, entity.get.id)

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
    getAll,
    getById,
    getByDni,
    getByEmail,
    getByPhone,
    getByIdentity,
    create,
    update,
    status: _models.User.statuses,
    role: _models.User.roles
  }
}

module.exports = userController
