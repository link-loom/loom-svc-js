class AuthRoute {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies
    this._utilities = this._dependencies.utilities
    this._controllers = this._dependencies.controllers

    /* Custom Properties */
    /* this._myPrivateProperty = 'Some value' */

    /* Assigments */
    /* this._newPrivateObject = new SomeObject(this._dependencies) */
  }

  /**
   * Route to login (GET http://<<URL>>/security/login)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async login (req, res) {
    const authController = new this._controllers.AuthController(this._dependencies)
    const params = this._utilities.request.getParameters(req)
    let response = {}

    response = await authController.login(params)

    res.json(response)
  }

  /**
   * Route to logout (GET http://<<URL>>/security/logout)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async logout (req, res) {
    const authController = new this._controllers.AuthController(this._dependencies)
    const params = this._utilities.request.getParameters(req)
    let response = {}

    response = await authController.logout(params)

    res.json(response)
  }

  /**
   * Route to validate account from email (GET http://<<URL>>/security/validate-email)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async validateEmail (req, res) {
    const authController = new this._controllers.AuthController(this._dependencies)
    const params = this._utilities.request.getParameters(req)
    let response = {}

    response = await authController.validateEmail(params)

    res.json(response)
  }

  /**
   * Route to validate account from chatbot (GET http://<<URL>>/security/validate-account-chatbot)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async validateAccountChatbot (req, res) {
    const authController = new this._controllers.AuthController(this._dependencies)
    const params = this._utilities.request.getParameters(req)
    let response = {}

    response = await authController.validateAccountChatbot(params)

    res.json(response)
  }
}

module.exports = AuthRoute
