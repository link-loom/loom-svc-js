function route (dependencies) {
  const _utilities = dependencies.utilities
  const _controllers = dependencies.controllers

  const get = async (req, res) => {
    const userController = new _controllers.UserController(dependencies)
    const params = _utilities.request.getParameters(req)
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
      response = await userController.getAll(params)
    }

    res.json(response)
  }

  /**
   * Create user
   *
   * route to show message (POST http://<<URL>>/api/user/create)
   */
  const create = async (req, res) => {
    const userController = new _controllers.UserController(dependencies)
    const params = _utilities.request.getParameters(req)
    let response = {}

    response = await userController.create(params)

    res.json(response)
  }

  /**
     * Update
     *
     * route to show message (POST http://<<URL>>/api/user/update)
     */
  const update = async (req, res) => {
    const userController = new _controllers.UserController(dependencies)
    const params = _utilities.request.getParameters(req)
    let response = {}

    response = await userController.update(params)

    res.json(response)
  }

  return {
    get,
    create,
    update
  }
}

module.exports = route
