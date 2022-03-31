function route (dependencies) {
  const _utilities = dependencies.utilities
  const _controllers = dependencies.controllers

  const get = async (req, res) => {
    let result = {}
    const params = _utilities.request.getParameters(req)
    const { id, deviceId, fingerprint, identity } = params

    if (id) {
      result = await _controllers.device.getById(params)
    } else if (deviceId) {
      result = await _controllers.device.getByUserId(params)
    } else if (fingerprint) {
      result = await _controllers.device.getByFingerprint(params)
    } else if (identity) {
      result = await _controllers.device.getByIdentity(params)
    } else {
      result = await _controllers.device.getAll(params)
    }

    res.json(result)
  }

  /**
   * Create device
   *
   * route to show message (POST http://<<URL>>/api/device/create)
   */
  const create = async (req, res) => {
    const params = _utilities.request.getParameters(req)
    const result = await _controllers.device.create(params)

    res.json(result)
  }

  /**
     * Update
     *
     * route to show message (POST http://<<URL>>/api/device/update)
     */
  const update = async (req, res) => {
    const params = _utilities.request.getParameters(req)
    const result = await _controllers.device.update(params)

    res.json(result)
  }

  return {
    get,
    create,
    update
  }
}

module.exports = route
