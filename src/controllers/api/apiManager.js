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

    _console.success('Boilerplate', 'API routes module initialized')
  }

  const createAPI = () => {
    router.api.map((component) => {
      let componentController = require(`${dependencies.root}/src/routes/api${component.controller}`)(dependencies)
      switch (component.method.toLocaleUpperCase()) {
        case 'GET':
          _apiRoutes.get(component.route, componentController[component.action])
          break
        case 'POST':
          _apiRoutes.post(component.route, componentController[component.action])
          break
        default:
          break
      }
    })

    /// Add some many routes
    /* _apiRoutes.post('/Video/Create', _video.createVideo);
    _apiRoutes.get('/Videos/Newest', _video.getAllNewestVideos); */

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
