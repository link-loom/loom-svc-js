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

    /* Assigments */
    /* this._newPrivateObject = new SomeObject(this._dependencies) */
    this._apiManagerService = new this._services.ApiManagerService(this._dependencies)
  }

  async authenticateUser (data, user) {
    const authenticationResult = this._utilities.validator.hash.isValid({ receivedPassword: data.password, hash: user.password })

    if (!authenticationResult) {
      return this._utilities.io.response.error('Wrong password. Try again or click Forgot password to reset it. After 3 failed attempts your account will be blocked by 24 hours.')
    }

    const entity = new this._models.UserManagement(user, this._dependencies)
    const sanitizedUser = entity.get
    const token = await this._utilities.generator.jwt.token({
      tokenizedData: sanitizedUser,
      payload: {
        identity: user.veripass_id, // Or change by your own ID
        session_time: Math.round(this._dependencies.config.TOKEN_EXPIRE / 24)
      },
      settings: {
        secret: this._dependencies.config.SERVER.SECRET,
        expiresIn: this._dependencies.config.SECURITY.JWT_TOKEN_LIFETIME_HOURS * 3600
      }
    })

    return this._utilities.io.response.success(token)
  }

  async login (data) {
    try {
      if (!data.identity) {
        return this._utilities.io.response.error('Data provided not match with any registered user')
      }

      const userService = new this._services.UserService(this._dependencies)
      const timestamp = (new Date()).getTime() + ''
      const userResponse = await userService.getByIdentity(data)

      if (!this._utilities.validator.response(userResponse)) {
        return this._utilities.io.response.error('User not found')
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
      return this._utilities.io.response.error()
    }
  }

  async validateEmail (data) {
    try {
      if (!data || !data.timestamp || !data.token) {
        return this._utilities.io.response.error(this._utilities.encoder.crypto.cypherObject(this._apiManagerService.key, 'Token is invalid, please try requesting another email.'))
      }

      const userService = new this._services.UserService(this._dependencies)
      const timestamp = +data.timestamp
      const hours = Math.floor(Math.abs(new Date() - new Date(+timestamp)) / 3.6e6)

      // Check if token is still valid
      if (this._dependencies.config.MAX_HOURS_TOKEN_VALID <= hours) {
        return this._utilities.io.response.error(this._utilities.encoder.crypto.cypherObject(this._apiManagerService.key, 'Token is outdated, please try requesting another email.'))
      }

      // Decode encrypted data
      const decodedToken = this._utilities.encoder.base64.decode(data.token)
      const decipheredToken = this._utilities.encoder.crypto.decipherObject(this._apiManagerService.key, decodedToken)

      // If decyphered data is valid
      if (!decipheredToken || !decipheredToken.email) {
        return this._utilities.io.response.error(this._utilities.encoder.crypto.cypherObject(this._apiManagerService.key, 'Token is not valid, please try requesting another email.'))
      }

      // Update the user
      decipheredToken.cipher = false
      decipheredToken.sanitized = false
      const userResult = await userService.getByEmail(decipheredToken)

      if (!this._utilities.validator.response(userResult)) {
        return this._utilities.io.response.error('Token is not valid, please try requesting another email.')
      }

      const updateResult = await userService.update({
        email: userResult.result.email,
        identity: userResult.result.email,
        is_account_actived: true
      })

      if (!this._utilities.validator.response(updateResult)) {
        return this._utilities.io.response.error(updateResult.message)
      }

      return this._utilities.io.response.success('Token is valid')
    } catch (error) {
      this._console.error(error)
      return this._utilities.io.response.error()
    }
  }

  async validateAccountChatbot (data) {
    if (!data || !data.chat || !data.chat.user) {
      return this._utilities.io.response.error('Is not possible validate account, please provide at least a phone number')
    }
    const userService = new this._services.UserService(this._dependencies)
    const userResult = await userService.getByIdentity({ identity: data.chat.user })

    if (!this._utilities.validator.response(userResult)) {
      return userResult
    }

    const updateResult = await userService.update({
      identity: data.chat.user,
      is_account_actived: true
    })

    if (!this._utilities.validator.response(updateResult)) {
      return this._utilities.io.response.error(updateResult.message)
    }

    return this._utilities.io.response.success('Token is valid')
  }
}

module.exports = AuthService
