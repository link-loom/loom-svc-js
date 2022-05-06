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
    const deviceController = new this._controllers.DeviceController(this._dependencies)
    const params = this._utilities.request.getParameters(req)
    const { id, deviceId, fingerprint, identity } = params
    let response = {}

    if (id) {
      response = await deviceController.getById(params)
    } else if (deviceId) {
      response = await deviceController.getByUserId(params)
    } else if (fingerprint) {
      response = await deviceController.getByFingerprint(params)
    } else if (identity) {
      response = await deviceController.getByIdentity(params)
    } else {
      response = await deviceController.get(params)
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
