class UserRoute {
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
   * Route to get status entity (GET http://<<URL>>/identity/user)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async get (req, res) {
    const userController = new this._controllers.UserController(this._dependencies)
    const params = this._utilities.request.getParameters(req)
    const { id, dni, phone, identity, email, businessId } = params
    let response = {}

    if (id) {
      response = await userController.getById(params)
    } else if (dni) {
      response = await userController.getByDni(params)
    } else if (phone) {
      response = await userController.getByPhone(params)
    } else if (identity) {
      response = await userController.getByIdentity(params)
    } else if (email) {
      response = await userController.getByEmail(params)
    } else if (businessId) {
      response = await userController.getAllByBusinessId(params)
    } else {
      response = await userController.get(params)
    }

    res.json(response)
  }

  /**
   * Route to get status entity (GET http://<<URL>>/identity/user)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async create (req, res) {
    const userController = new this._controllers.UserController(this._dependencies)
    const params = this._utilities.request.getParameters(req)
    let response = {}

    response = await userController.create(params)

    res.json(response)
  }

  /**
   * Route to get status entity (GET http://<<URL>>/identity/user)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async update (req, res) {
    const userController = new this._controllers.UserController(this._dependencies)
    const params = this._utilities.request.getParameters(req)
    let response = {}

    response = await userController.update(params)

    res.json(response)
  }
}

module.exports = UserRoute
