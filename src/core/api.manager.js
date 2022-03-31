class ApiManager {
  constructor (dependencies) {
    this._dependencies = dependencies
    this._console = dependencies.console
    this._app = dependencies.express
    this._express = dependencies.expressModule
    this._auth = dependencies.auth
    this._storage = dependencies.storage
    this._apiRoutes = this._express.Router()
    this._path = dependencies.path

    this.createAPIEndpoints()

    this._console.success('API manager loaded')
  }

  buildGetEndpoints (controller, domain, endpoint) {
    if (endpoint.protected) {
      this._apiRoutes.get(`/${domain}${endpoint.httpRoute}`, this._auth.middleware.validateApi, controller[endpoint.handler])
    } else {
      this._apiRoutes.get(`/${domain}${endpoint.httpRoute}`, controller[endpoint.handler])
    }
  }

  buildPostEndpoints (controller, domain, endpoint) {
    if (endpoint.isUpload && this._storage) {
      this._apiRoutes.post(`/${domain}${endpoint.httpRoute}`, this._storage.single('file'), controller[endpoint.handler])
      return
    }

    if (endpoint.protected) {
      this._apiRoutes.post(`/${domain}${endpoint.httpRoute}`, this._auth.middleware.validateApi, controller[endpoint.handler])
    } else {
      this._apiRoutes.post(`/${domain}${endpoint.httpRoute}`, controller[endpoint.handler])
    }
  }

  buildPutEndpoints (controller, domain, endpoint) {
    if (endpoint.protected) {
      this._apiRoutes.put(`/${domain}${endpoint.httpRoute}`, this._auth.middleware.validateApi, controller[endpoint.handler])
    } else {
      this._apiRoutes.put(`/${domain}${endpoint.httpRoute}`, controller[endpoint.handler])
    }
  }

  buildPatchEnpoints (controller, domain, endpoint) {
    if (endpoint.protected) {
      this._apiRoutes.patch(`/${domain}${endpoint.httpRoute}`, this._auth.middleware.validateApi, controller[endpoint.handler])
    } else {
      this._apiRoutes.patch(`/${domain}${endpoint.httpRoute}`, controller[endpoint.handler])
    }
  }

  buildDeleteEndpoints (controller, domain, endpoint) {
    if (endpoint.protected) {
      this._apiRoutes.delete(`/${domain}${endpoint.httpRoute}`, this._auth.middleware.validateApi, controller[endpoint.handler])
    } else {
      this._apiRoutes.delete(`/${domain}${endpoint.httpRoute}`, controller[endpoint.handler])
    }
  }

  createAPIEndpoints () {
    const router = require(this._path.join(this._dependencies.root, 'src', 'routes', 'router'))

    // build each api routes
    for (const domainName in router) {
      if (Object.hasOwnProperty.call(router, domainName)) {
        const domain = router[domainName]

        domain.map((endpoint) => {
          try {
            const controller = require(this._path.join(this._dependencies.root, `src/${endpoint.route}`))(this._dependencies)
            switch (endpoint.method.toLocaleUpperCase()) {
              case 'GET':
                this.buildGetEndpoints(controller, domainName, endpoint)
                break
              case 'POST':
                this.buildPostEndpoints(controller, domainName, endpoint)
                break
              case 'PUT':
                this.buildPutEndpoints(controller, domainName, endpoint)
                break
              case 'PATCH':
                this.buildPatchEnpoints(controller, domainName, endpoint)
                break
              case 'DELETE':
                this.buildDeleteEndpoints(controller, domainName, endpoint)
                break
              default:
                break
            }
          } catch (error) {
            this._console.error(`Endpoint failed: ${JSON.stringify(endpoint)}`, true)
          }
        })
      }
    }

    // apply the routes to our application with the prefix /api
    this._app.use('/', this._apiRoutes)

    // Something else route response a 404 error
    this._apiRoutes.get('*', function (req, res) {
      res.status(404).send('This API is not fully armed and operational... Try another valid route.')
    })
  }
}

module.exports = { ApiManager }
