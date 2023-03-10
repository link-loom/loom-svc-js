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
    const entityController = new this._controllers.UserController(this._dependencies)
    const params = this._utilities.request.getParameters(req)
    let response = {}

    switch (params.queryselector) {
      case 'id':
        response = await entityController.getById(params)
        break
      case 'national-id':
        response = await entityController.getByNationalId(params)
        break
      case 'phone':
        response = await entityController.getByPhone(params)
        break
      case 'email':
        response = await entityController.getByEmail(params)
        break
      case 'business-id':
        response = await entityController.getByBusinessId(params)
        break
      default:
        response = this._utilities.response.error('Provide a valid slug to query')
        break
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
