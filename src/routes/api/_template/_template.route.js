class TemplateRoute {
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
   * Route to get status entity (GET http://<<URL>>/example/template)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async get (req, res) {
    const entityController = new this._controllers.TemplateController(this._dependencies)
    const params = this._utilities.request.getParameters(req)
    const { id, PROPERTY } = params
    let response = {}

    if (id) {
      response = await entityController.getById(params)
    } else if (PROPERTY) {
      response = await entityController.getByPROPERTY(params)
    } else {
      response = await entityController.get(params)
    }

    res.json(response)
  }

  /**
   * Route to get status entity (GET http://<<URL>>/example/template)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async create (req, res) {
    const entityController = new this._controllers.TemplateController(this._dependencies)
    const params = this._utilities.request.getParameters(req)
    let response = {}

    response = await entityController.create(params)

    res.json(response)
  }

  /**
   * Route to get status entity (GET http://<<URL>>/example/template)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async update (req, res) {
    const entityController = new this._controllers.TemplateController(this._dependencies)
    const params = this._utilities.request.getParameters(req)
    let response = {}

    response = await entityController.update(params)

    res.json(response)
  }
}

module.exports = TemplateRoute
