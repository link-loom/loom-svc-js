function route (dependencies) {
  const _utilities = dependencies.utilities
  const _controllers = dependencies.controllers

  const get = async (req, res) => {
    let result = {}
    const params = _utilities.request.getParameters(req)
    const { id, businessId, receiver, q } = params

    if (id) {
      result = await _controllers.notification.getById(params)
    } else if (receiver) {
      result = await _controllers.notification.getAllByReceiver(params)
    } else if (businessId) {
      result = await _controllers.notification.getByBusinessId(params)
    } else if (receiver && q.toLocaleLowerCase().includes('folder')) {
      result = await _controllers.notification.getAllGroupedByFoldersAndByReceiver(params)
    } else if (receiver && q.toLocaleLowerCase().includes('last')) {
      result = await _controllers.notification.getAllLastByReceiver(params)
    } else {
      result = await _controllers.notification.getAll(params)
    }

    res.json(result)
  }

  /**
   * Create
   *
   * route to show message (POST http://<<URL>>/api/notification/create)
   */
  const create = async (req, res) => {
    const params = _utilities.request.getParameters(req)
    const result = await _controllers.notification.create(params)

    res.json(result)
  }

  /**
     * Update
     *
     * route to show message (POST http://<<URL>>/api/notification/update)
     */
  const update = async (req, res) => {
    const params = _utilities.request.getParameters(req)
    const result = await _controllers.notification.update(params)

    res.json(result)
  }

  return {
    get,
    create,
    update
  }
}

module.exports = route
