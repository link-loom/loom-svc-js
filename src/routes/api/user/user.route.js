function route (dependencies) {
  const _utilities = dependencies.utilities
  const _controllers = dependencies.controllers

  const get = async (req, res) => {
    let result = {}
    const params = _utilities.request.getParameters(req)
    const { id, dni, phone, identity, email, businessId } = params

    if (id) {
      result = await _controllers.user.getById(params)
    } else if (dni) {
      result = await _controllers.user.getByDni(params)
    } else if (phone) {
      result = await _controllers.user.getByPhone(params)
    } else if (identity) {
      result = await _controllers.user.getByIdentity(params)
    } else if (email) {
      result = await _controllers.user.getByEmail(params)
    } else if (businessId) {
      result = await _controllers.user.getAllByBusinessId(params)
    } else {
      result = await _controllers.user.getAll(params)
    }

    res.json(result)
  }

  /**
   * Create user
   *
   * route to show message (POST http://<<URL>>/api/user/create)
   */
  const create = async (req, res) => {
    const params = _utilities.request.getParameters(req)
    const result = await _controllers.user.create(params)

    res.json(result)
  }

  /**
     * Update
     *
     * route to show message (POST http://<<URL>>/api/user/update)
     */
  const update = async (req, res) => {
    const params = _utilities.request.getParameters(req)
    const result = await _controllers.user.update(params)

    res.json(result)
  }

  return {
    get,
    create,
    update
  }
}

module.exports = route
