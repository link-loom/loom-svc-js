function apiManager (dependencies) {
  const router = require(`${dependencies.root}/src/routes/router`)

  /// Dependencies
  const _console = dependencies.console
  const _app = dependencies.httpServer
  const _express = dependencies.express
  const _auth = dependencies.auth

  var _apiRoutes

  const constructor = () => {
    _apiRoutes = _express.Router()

    createAPI()

    _console.success('API routes module initialized')
  }

  const createAPI = () => {
    // build each api routes
    router.api.map((component) => {
      try {
        let componentController = require(`${dependencies.root}/src${component.route}`)(dependencies)
        switch (component.method.toLocaleUpperCase()) {
          case 'GET':
            if (component.protected) {
              _apiRoutes.get(component.httpRoute, _auth.middleware.validateApi, componentController[component.handler])
            } else {
              _apiRoutes.get(component.httpRoute, componentController[component.handler])
            }
            break
          case 'POST':
            if (component.protected) {
              _apiRoutes.post(component.httpRoute, _auth.middleware.validateApi, componentController[component.handler])
            } else {
              _apiRoutes.post(component.httpRoute, componentController[component.handler])
            }
            break
          case 'PUT':
            if (component.protected) {
              _apiRoutes.put(component.httpRoute, _auth.middleware.validateApi, componentController[component.handler])
            } else {
              _apiRoutes.put(component.httpRoute, componentController[component.handler])
            }
            break
          case 'PATCH':
            if (component.protected) {
              _apiRoutes.patch(component.httpRoute, _auth.middleware.validateApi, componentController[component.handler])
            } else {
              _apiRoutes.patch(component.httpRoute, componentController[component.handler])
            }
            break
          case 'DELETE':
            if (component.protected) {
              _apiRoutes.delete(component.httpRoute, _auth.middleware.validateApi, componentController[component.handler])
            } else {
              _apiRoutes.delete(component.httpRoute, componentController[component.handler])
            }
            break
          default:
            break
        }
      } catch (error) {
        _console.error(`Component failed: ${JSON.stringify(component)}`)
        _console.error(error)
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
