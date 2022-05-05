function route (dependencies) {
  const _utilities = dependencies.utilities
  const _controllers = dependencies.controllers

  const get = async (req, res) => {
    const deviceController = new _controllers.DeviceController(dependencies)
    const params = _utilities.request.getParameters(req)
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
      response = await deviceController.getAll(params)
    }

    res.json(response)
  }

  /**
   * Create device
   *
   * route to show message (POST http://<<URL>>/api/device/create)
   */
  const create = async (req, res) => {
    const deviceController = new _controllers.DeviceController(dependencies)
    const params = _utilities.request.getParameters(req)
    let response = {}

    response = await deviceController.create(params)

    res.json(response)
  }

  /**
     * Update
     *
     * route to show message (POST http://<<URL>>/api/device/update)
     */
  const update = async (req, res) => {
    const deviceController = new _controllers.DeviceController(dependencies)
    const params = _utilities.request.getParameters(req)
    let response = {}

    response = await deviceController.update(params)

    res.json(response)
  }

  return {
    get,
    create,
    update
  }
}

module.exports = route
