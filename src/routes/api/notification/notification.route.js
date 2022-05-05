function route (dependencies) {
  const _utilities = dependencies.utilities
  const _controllers = dependencies.controllers

  const get = async (req, res) => {
    const notificationController = new _controllers.NotificationController(dependencies)
    const params = _utilities.request.getParameters(req)
    const { id, businessId, receiver, q } = params
    let response = {}

    if (id) {
      response = await notificationController.getById(params)
    } else if (receiver) {
      response = await notificationController.getAllByReceiver(params)
    } else if (businessId) {
      response = await notificationController.getByBusinessId(params)
    } else if (receiver && q.toLocaleLowerCase().includes('folder')) {
      response = await notificationController.getAllGroupedByFoldersAndByReceiver(params)
    } else if (receiver && q.toLocaleLowerCase().includes('last')) {
      response = await notificationController.getAllLastByReceiver(params)
    } else {
      response = await notificationController.getAll(params)
    }

    res.json(response)
  }

  /**
   * Create
   *
   * route to show message (POST http://<<URL>>/api/notification/create)
   */
  const create = async (req, res) => {
    const notificationController = new _controllers.NotificationController(dependencies)
    const params = _utilities.request.getParameters(req)
    let response = {}

    response = await notificationController.create(params)

    res.json(response)
  }

  /**
     * Update
     *
     * route to show message (POST http://<<URL>>/api/notification/update)
     */
  const update = async (req, res) => {
    const notificationController = new _controllers.NotificationController(dependencies)
    const params = _utilities.request.getParameters(req)
    let response = {}

    response = await notificationController.update(params)

    res.json(response)
  }

  return {
    get,
    create,
    update
  }
}

module.exports = route
