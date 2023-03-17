class AuthService {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies
    this._db = dependencies.db
    this._models = dependencies.models
    this._utilities = dependencies.utilities
    this._console = this._dependencies.console
    this._firebase = dependencies.firebaseManager
    this._services = this._dependencies.services

    /* Custom Properties */
    this._auth = this._dependencies.auth

    /* Assigments */
    /* this._newPrivateObject = new SomeObject(this._dependencies) */
    this._backendService = new this._services.BackendService(this._dependencies)
  }

  async authenticateUser (data, user) {
    const authenticationResult = this._auth.hash.isValid({ receivedPassword: data.password, hash: user.password })

    if (!authenticationResult) {
      return this._utilities.response.error('Wrong password. Try again or click Forgot password to reset it. After 3 failed attempts your account will be blocked by 24 hours.')
    }

    const entity = new this._models.User(user, this._dependencies)
    const sanitizedUser = entity.get
    const token = await this._auth.token.create(sanitizedUser, {
      identity: user.national_id || user.phone || user.email,
      session_time: Math.round(this._dependencies.config.TOKEN_EXPIRE / 24)
    })

    return this._utilities.response.success(token)
  }

  async logout () {
    const token = await this._auth.token.destroy()
    return this._utilities.response.success(token)
  }

  async login (data) {
    try {
      if (!data.identity) {
        return this._utilities.response.error('Data provided not match with any registered user')
      }

      const userService = new this._services.UserService(this._dependencies)
      const timestamp = (new Date()).getTime() + ''
      const userResponse = await userService.getByIdentity(data)

      if (!this._utilities.response.isValid(userResponse)) {
        return this._utilities.response.error('User not found')
      }

      const user = userResponse.result
      const result = await this.authenticateUser(data, user)

      userService.update({
        last_login: timestamp,
        identity: data.id,
        session_time: Math.round(this._dependencies.config.TOKEN_EXPIRE / 24)
      })

      return result
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async validateEmail (data) {
    try {
      if (!data || !data.timestamp || !data.token) {
        return this._utilities.response.error(this._auth.crypto.cypherObject(this._backendService.key, 'Token is invalid, please try requesting another email.'))
      }

      const userService = new this._services.UserService(this._dependencies)
      const timestamp = +data.timestamp
      const hours = Math.floor(Math.abs(new Date() - new Date(+timestamp)) / 3.6e6)

      // Check if token is still valid
      if (this.dependencies.config.MAX_HOURS_TOKEN_VALID <= hours) {
        return this._utilities.response.error(this._auth.crypto.cypherObject(this._backendService.key, 'Token is outdated, please try requesting another email.'))
      }

      // Decode encrypted data
      const decodedToken = this._auth.encoder.base64.decode(data.token)
      const decipheredToken = this._auth.crypto.decipherObject(this._backendService.key, decodedToken)

      // If decyphered data is valid
      if (!decipheredToken || !decipheredToken.email) {
        return this._utilities.response.error(this._auth.crypto.cypherObject(this._backendService.key, 'Token is not valid, please try requesting another email.'))
      }

      // Update the user
      decipheredToken.cipher = false
      decipheredToken.sanitized = false
      const userResult = await userService.getByEmail(decipheredToken)

      if (!this._utilities.response.isValid(userResult)) {
        return this._utilities.response.error('Token is not valid, please try requesting another email.')
      }

      const updateResult = await userService.update({
        email: userResult.result.email,
        identity: userResult.result.email,
        is_account_actived: true
      })

      if (!this._utilities.response.isValid(updateResult)) {
        return this._utilities.response.error(updateResult.message)
      }

      return this._utilities.response.success('Token is valid')
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async validateAccountChatbot (data) {
    if (!data || !data.chat || !data.chat.user) {
      return this._utilities.response.error('Is not possible validate account, please provide at least a phone number')
    }
    const userService = new this._services.UserService(this._dependencies)
    const userResult = await userService.getByIdentity({ identity: data.chat.user })

    if (!this._utilities.response.isValid(userResult)) {
      return userResult
    }

    const updateResult = await userService.update({
      identity: data.chat.user,
      is_account_actived: true
    })

    if (!this._utilities.response.isValid(updateResult)) {
      return this._utilities.response.error(updateResult.message)
    }

    return this._utilities.response.success('Token is valid')
  }

  get status () {
    return this.this._models.Auth.statuses
  }
}

module.exports = AuthService
