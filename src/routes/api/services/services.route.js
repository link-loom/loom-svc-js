
function route (dependencies) {
  const _controllers = dependencies.controllers
  const _utilities = dependencies.utilities

  /**
     * Get Backend parameters URI
     *
     * route to show message (GET http://<<URL>>/api/services/backend-uri)
     */
  const getBackendUri = async (req, res) => {
    const params = _utilities.request.getParameters(req)
    const result = await _controllers.services.getBackendUri(params)

    res.json(result)
  }

  return {
    getBackendUri
  }
}

module.exports = route
