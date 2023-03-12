class AuthRoute {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies
    this._utilities = this._dependencies.utilities
    this._console = this._dependencies.console
    this._controllers = this._dependencies.controllers

    /* Custom Properties */
    /* this._myPrivateProperty = 'Some value' */

    /* Assigments */
    /* this._newPrivateObject = new SomeObject(this._dependencies) */
    this.EntityController = this._controllers.AuthController
  }

  /**
   * Route to login (GET http://<<URL>>/security/login)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async login ({ params }) {
    try {
      const entityController = new this.EntityController(this._dependencies)

      return entityController.login(params)
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  /**
   * Route to logout (GET http://<<URL>>/security/logout)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async logout ({ params }) {
    try {
      const entityController = new this.EntityController(this._dependencies)

      return entityController.logout(params)
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  /**
   * Route to validate account from email (GET http://<<URL>>/security/validate-email)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async validateEmail ({ params }) {
    try {
      const entityController = new this.EntityController(this._dependencies)

      return entityController.validateEmail(params)
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  /**
   * Route to validate account from chatbot (GET http://<<URL>>/security/validate-account-chatbot)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async validateAccountChatbot ({ params }) {
    try {
      const entityController = new this.EntityController(this._dependencies)

      return entityController.validateAccountChatbot(params)
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }
}

module.exports = AuthRoute
