function status (dependencies) {
  const _controllers = dependencies.controllers
  const _utilities = dependencies.utilities

  /**
     * Status
     *
     * route to show message (GET http://<<URL>>/api/status)
     */
  const get = async (req, res) => {
    const statusController = new _controllers.StatusController(dependencies)
    const params = _utilities.request.getParameters(req)
    let response = {}

    response = await statusController.get(params)

    res.json(response)
  }

  return {
    get
  }
}

module.exports = status
