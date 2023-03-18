class AuthRoute {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies
    this._utilities = this._dependencies.utilities
    this._console = this._dependencies.console
    this._services = this._dependencies.services

    /* Custom Properties */
    /* this._myPrivateProperty = 'Some value' */

    /* Assigments */
    /* this._newPrivateObject = new SomeObject(this._dependencies) */
    this.EntityService = this._services.AuthService
  }

  /**
   * Route to login (GET http://<<URL>>/security/login)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async login ({ params }) {
    try {
      const entityService = new this.EntityService(this._dependencies)

      return entityService.login(params)
    } catch (error) {
      this._console.error(error)
      return this._utilities.io.response.error()
    }
  }

  /**
   * Route to logout (GET http://<<URL>>/security/logout)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async logout ({ params }) {
    try {
      const entityService = new this.EntityService(this._dependencies)

      return entityService.logout(params)
    } catch (error) {
      this._console.error(error)
      return this._utilities.io.response.error()
    }
  }

  /**
   * Route to validate account from email (GET http://<<URL>>/security/validate-email)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async validateEmail ({ params }) {
    try {
      const entityService = new this.EntityService(this._dependencies)

      return entityService.validateEmail(params)
    } catch (error) {
      this._console.error(error)
      return this._utilities.io.response.error()
    }
  }

  /**
   * Route to validate account from chatbot (GET http://<<URL>>/security/validate-account-chatbot)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async validateAccountChatbot ({ params }) {
    try {
      const entityService = new this.EntityService(this._dependencies)

      return entityService.validateAccountChatbot(params)
    } catch (error) {
      this._console.error(error)
      return this._utilities.io.response.error()
    }
  }
}

module.exports = AuthRoute
