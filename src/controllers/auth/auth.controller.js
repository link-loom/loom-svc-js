function authController (dependencies) {
  const _console = dependencies.console
  const _utilities = dependencies.utilities
  const _auth = dependencies.auth
  const _controllers = dependencies.controllers
  const _models = dependencies.models

  const authenticateUser = async (data, user) => {
    const authenticationResult = _auth.hash.isValid({ receivedPassword: data.password, hash: user.password })

    if (!authenticationResult) {
      return _utilities.response.error('Wrong password. Try again or click Forgot password to reset it. After 3 failed attempts your account will be blocked by 24 hours.')
    }

    const entity = new _models.User(user, dependencies)
    const sanitizedUser = entity.get
    const token = await _auth.token.create(sanitizedUser, {
      identity: user.dni || user.phone || user.email
    })

    return _utilities.response.success(token)
  }

  const logout = async () => {
    const token = await _auth.token.destroy()
    return _utilities.response.success(token)
  }

  const login = async (data) => {
    try {
      if (!data.identity) {
        return _utilities.response.error('Data provided not match with any registered user')
      }

      const timestamp = (new Date()).getTime() + ''
      const userResponse = await _controllers.user.getByIdentity(data)

      if (!_utilities.response.isValid(userResponse)) {
        return _utilities.response.error('User not found')
      }

      const user = userResponse.result
      const result = await authenticateUser(data, user)

      _controllers.user.update({ last_login: timestamp, identity: data.id, session_time: Math.round(dependencies.config.TOKEN_EXPIRE / 24) })

      return result
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const validateEmail = async (data) => {
    try {
      if (!data || !data.timestamp || !data.token) {
        return _utilities.response.error(_auth.crypto.cypherObject(_controllers.backend.getKey(), 'Token is invalid, please try requesting another email.'))
      }

      const timestamp = +data.timestamp
      const hours = Math.floor(Math.abs(new Date() - new Date(+timestamp)) / 3.6e6)

      // Check if token is still valid
      if (dependencies.config.MAX_HOURS_TOKEN_VALID <= hours) {
        return _utilities.response.error(_auth.crypto.cypherObject(_controllers.backend.getKey(), 'Token is outdated, please try requesting another email.'))
      }

      // Decode encrypted data
      const decodedToken = _auth.encoder.base64.decode(data.token)
      const decipheredToken = _auth.crypto.decipherObject(_controllers.backend.getKey(), decodedToken)

      // If decyphered data is valid
      if (!decipheredToken || !decipheredToken.email) {
        return _utilities.response.error(_auth.crypto.cypherObject(_controllers.backend.getKey(), 'Token is not valid, please try requesting another email.'))
      }

      // Update the user
      decipheredToken.cipher = false
      decipheredToken.sanitized = false
      const userResult = await _controllers.user.getByEmail(decipheredToken)

      if (!_utilities.response.isValid(userResult)) {
        return _utilities.response.error('Token is not valid, please try requesting another email.')
      }

      const updateResult = await _controllers.user.update({
        email: userResult.result.email,
        identity: userResult.result.email,
        is_account_actived: true
      })

      if (!_utilities.response.isValid(updateResult)) {
        return _utilities.response.error(updateResult.message)
      }

      return _utilities.response.success('Token is valid')
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const validateAccountChatbot = async (data) => {
    if (!data || !data.chat || !data.chat.user) {
      return _utilities.response.error('Is not possible validate account, please provide at least a phone number')
    }

    const userResult = await _controllers.user.getByIdentity({ identity: data.chat.user })

    if (!_utilities.response.isValid(userResult)) {
      return userResult
    }

    const updateResult = await _controllers.user.update({
      identity: data.chat.user,
      is_account_actived: true
    })

    if (!_utilities.response.isValid(updateResult)) {
      return _utilities.response.error(updateResult.message)
    }

    return _utilities.response.success('Token is valid')
  }

  return {
    login,
    logout,
    validateEmail,
    validateAccountChatbot
  }
}

module.exports = authController
