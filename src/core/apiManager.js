function apiManager (dependencies) {
  const router = require(`${dependencies.root}/src/routes/definition/router`)

  /// Dependencies
  const _console = dependencies.console
  const _app = dependencies.httpServer
  const _express = dependencies.express

  var _apiRoutes

  const constructor = () => {
    _apiRoutes = _express.Router()

    createAPI()

    _console.success('API routes module initialized')
  }

  const createAPI = () => {
    // build each api routes
    router.api.map((component) => {
      let componentController = require(`${dependencies.root}/src${component.route}`)(dependencies)
      switch (component.method.toLocaleUpperCase()) {
        case 'GET':
          _apiRoutes.get(component.httpRoute, componentController[component.handler])
          break
        case 'POST':
          _apiRoutes.post(component.httpRoute, componentController[component.handler])
          break
        default:
          break
      }
    })

    // apply the routes to our application with the prefix /api
    _app.use('/api', _apiRoutes)

    // Something else route response a 404 error
    _apiRoutes.get('*', function (req, res) {
      res.status(404).send('This API is not fully armed and operational... Try another valid route.')
    })
  }

  return {
    start: constructor
  }
}

module.exports = apiManager
