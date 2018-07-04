function userController (dependencies) {
  const _db = dependencies.db
  const _console = dependencies.console
  const _firebase = dependencies.firebaseManager
  const _utilities = dependencies.utilities
  const _auth = dependencies.auth

  const _status = {
    inactive: 1,
    active: 1,
    deleted: 2
  }

  const get = async () => {
    try {
      // Get values from reference as snapshot
      let rawUsers = await _db.ref(`users`).once('value')
      // Cast Firebase object into an arry of users
      let users = _firebase.cast.array(rawUsers)

      // Check if exist any data
      if (users && users.data.length > 0) {
        // Remove sensitive data
        users.data.map((user) => { delete user.password })
        return _utilities.response.success(users.data)
      } else {
        return _utilities.response.error('No users found')
      }
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const getById = async (data) => {
    try {
      if (data.id) {
        // Do query in Firebase
        let rawUser = await _db.ref(`users`)
          .orderByChild('id')
          .startAt(data.id)
          .endAt(data.id)
          .once('value')
        // Cast the Firebase object returned to a simple JSON object
        let user = _firebase.cast.object(rawUser)

        if (user) {
          // Removed sensitive data
          delete user.password
          return _utilities.response.success(user)
        } else {
          return _utilities.response.error('User not found')
        }
      } else {
        return _utilities.response.error('Please provide an id')
      }
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const getByUsername = async (data) => {
    try {
      if (data && data.username) {
        // Do query in Firebase
        let rawUser = await _db.ref(`users`)
          .orderByChild('username')
          .startAt(data.username)
          .endAt(data.username)
          .once('value')
        // Cast the Firebase object returned to a simple JSON object
        let user = _firebase.cast.object(rawUser)

        if (user) {
          return _utilities.response.success(user)
        } else {
          return _utilities.response.error('User not found')
        }
      } else {
        return _utilities.response.error('Please provide an id')
      }
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const create = async (data) => {
    try {
      if (data && data.username && data.password) {
        // Generate a mnemonic id to be a secondary key
        data.id = _utilities.idGenerator(5, 'usr-')

        let userRef = _db.ref('users').push()
        let timestamp = (new Date()).getTime() + ''
        // Generate a hash with user plain text password
        let userPasswordHash = _auth.hash.stringToHash(data.password || '')

        let result = await userRef.set({
          id: data.id,
          username: data.username || '', // Set as default empty string
          password: userPasswordHash,
          firstname: data.firstname || '',
          lastname: data.lastname || '',
          status: _status.active,
          lastLogin: '',
          lastTimeOnApp: '',
          lastModification: timestamp
        })

        // Removing sensitive data
        delete data.id
        delete data.password

        if (result) {
          _console.error(result)
          return _utilities.response.error()
        } else {
          return _utilities.response.success(data)
        }
      } else {
        return _utilities.response.error('Please provide minimum data to create a user')
      }
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const update = async (data) => {
    try {
      let userResult = await getById(data)

      // Check if response from getById function has a valid data (no null result and success response)
      if (_utilities.response.isValid(userResult)) {
        // Remove all data and return only response data
        let user = _utilities.response.clean(userResult.result)
        let timestamp = (new Date()).getTime() + ''

        let result = await _db.ref(`users/${userResult.result.rawId}`)
          .update({
            username: data.username || (user.username || ''),
            password: data.password || (user.password || ''),
            firstname: data.firstname || (user.firstname || ''),
            lastname: data.lastname || (user.lastname || ''),
            status: data.status || (user.status || _status.active),
            lastLogin: data.lastLogin || (user.lastLogin || ''),
            lastTimeOnApp: data.lastTimeOnApp || (user.lastModification || ''),
            lastModification: timestamp
          })
        if (result) {
          // Firebase API return data if exist any problem
          return _utilities.response.error(result)
        } else {
          // Return current modified data
          return _utilities.response.success(data)
        }
      } else {
        return _utilities.response.error(userResult.message)
      }
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  return {
    getAll: get,
    getById,
    getByUsername,
    create,
    update
  }
}

module.exports = userController
