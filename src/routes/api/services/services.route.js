
function route (dependencies) {
  const _controllers = dependencies.controllers
  const _utilities = dependencies.utilities

  /**
     * Get Backend parameters URI
     *
     * route to show message (GET http://<<URL>>/api/services/backend-uri)
     */
  const getBackendUri = async (req, res) => {
    const servicesController = new _controllers.ServicesController(dependencies)
    const params = _utilities.request.getParameters(req)
    let response = {}

    response = await servicesController.getBackendUri(params)

    res.json(response)
  }

  return {
    getBackendUri
  }
}

module.exports = route
