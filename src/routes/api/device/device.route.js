class DeviceRoute {
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
   * Route to get status entity (GET http://<<URL>>/identity/device)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async get (req, res) {
    const entityController = new this._controllers.DeviceController(this._dependencies)
    const params = this._utilities.request.getParameters(req)
    let response = {}

    switch (params.queryselector) {
      case 'id':
        response = await entityController.getById(params)
        break
      case 'user-id':
        response = await entityController.getByUserId(params)
        break
      case 'fingerprint':
        response = await entityController.getByFingerprint(params)
        break
      case 'identity':
        response = await entityController.getByIdentity(params)
        break
      default:
        response = this._utilities.response.error('Provide a valid slug to query')
        break
    }

    res.json(response)
  }

  /**
   * Route to get status entity (GET http://<<URL>>/identity/device)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async create (req, res) {
    const deviceController = new this._controllers.DeviceController(this._dependencies)
    const params = this._utilities.request.getParameters(req)
    let response = {}

    response = await deviceController.create(params)

    res.json(response)
  }

  /**
   * Route to get status entity (GET http://<<URL>>/identity/device)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async update (req, res) {
    const deviceController = new this._controllers.DeviceController(this._dependencies)
    const params = this._utilities.request.getParameters(req)
    let response = {}

    response = await deviceController.update(params)

    res.json(response)
  }
}

module.exports = DeviceRoute
