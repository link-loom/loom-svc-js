class ApiManager {
  constructor (dependencies) {
    this._dependencies = dependencies
    this._console = dependencies.console
    this._app = dependencies.express
    this._express = dependencies.expressModule
    this._auth = dependencies.auth
    this._storage = dependencies.storage
    this._apiRoutes = this._express.Router()

    this.createAPIEndpoints()

    this._console.success('API manager loaded')
  }

  createAPIEndpoints () {
    const router = require(`${this._dependencies.root}/src/routes/router`)

    // build each api routes
    router.api.map((component) => {
      try {
        const componentController = require(`${this._dependencies.root}/src${component.route}`)(this._dependencies)
        switch (component.method.toLocaleUpperCase()) {
          case 'GET':
            if (component.protected) {
              this._apiRoutes.get(component.httpRoute, this._auth.middleware.validateApi, componentController[component.handler])
            } else {
              this._apiRoutes.get(component.httpRoute, componentController[component.handler])
            }
            break
          case 'POST':
            if (component.isUpload) {
              this._apiRoutes.post(component.httpRoute, this._storage.single('file'), componentController[component.handler])
              break
            }

            if (component.protected) {
              this._apiRoutes.post(component.httpRoute, this._auth.middleware.validateApi, componentController[component.handler])
            } else {
              this._apiRoutes.post(component.httpRoute, componentController[component.handler])
            }
            break
          case 'PUT':
            if (component.protected) {
              this._apiRoutes.put(component.httpRoute, this._auth.middleware.validateApi, componentController[component.handler])
            } else {
              this._apiRoutes.put(component.httpRoute, componentController[component.handler])
            }
            break
          case 'PATCH':
            if (component.protected) {
              this._apiRoutes.patch(component.httpRoute, this._auth.middleware.validateApi, componentController[component.handler])
            } else {
              this._apiRoutes.patch(component.httpRoute, componentController[component.handler])
            }
            break
          case 'DELETE':
            if (component.protected) {
              this._apiRoutes.delete(component.httpRoute, this._auth.middleware.validateApi, componentController[component.handler])
            } else {
              this._apiRoutes.delete(component.httpRoute, componentController[component.handler])
            }
            break
          default:
            break
        }
      } catch (error) {
        this._console.error(`Component failed: ${JSON.stringify(component)}`, true)
      }
    })

    // apply the routes to our application with the prefix /api
    this._app.use('/api', this._apiRoutes)

    // Something else route response a 404 error
    this._apiRoutes.get('*', function (req, res) {
      res.status(404).send('This API is not fully armed and operational... Try another valid route.')
    })
  }
}

module.exports = { ApiManager }
