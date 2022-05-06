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

  buildGetEndpoints (route, domain, endpoint) {
    if (endpoint.protected) {
      this._apiRoutes.get(`/${domain}${endpoint.httpRoute}`, this._auth.middleware.validateApi, (req, res) => route[endpoint.handler](req, res))
    } else {
      this._apiRoutes.get(`/${domain}${endpoint.httpRoute}`, (req, res) => route[endpoint.handler](req, res))
    }
  }

  buildPostEndpoints (route, domain, endpoint) {
    if (endpoint.isUpload && this._storage) {
      this._apiRoutes.post(`/${domain}${endpoint.httpRoute}`, this._storage.single('file'), (req, res) => route[endpoint.handler](req, res))
      return
    }

    if (endpoint.protected) {
      this._apiRoutes.post(`/${domain}${endpoint.httpRoute}`, this._auth.middleware.validateApi, (req, res) => route[endpoint.handler](req, res))
    } else {
      this._apiRoutes.post(`/${domain}${endpoint.httpRoute}`, (req, res) => route[endpoint.handler](req, res))
    }
  }

  buildPutEndpoints (route, domain, endpoint) {
    if (endpoint.protected) {
      this._apiRoutes.put(`/${domain}${endpoint.httpRoute}`, this._auth.middleware.validateApi, (req, res) => route[endpoint.handler](req, res))
    } else {
      this._apiRoutes.put(`/${domain}${endpoint.httpRoute}`, (req, res) => route[endpoint.handler](req, res))
    }
  }

  buildPatchEnpoints (route, domain, endpoint) {
    if (endpoint.protected) {
      this._apiRoutes.patch(`/${domain}${endpoint.httpRoute}`, this._auth.middleware.validateApi, (req, res) => route[endpoint.handler](req, res))
    } else {
      this._apiRoutes.patch(`/${domain}${endpoint.httpRoute}`, (req, res) => route[endpoint.handler](req, res))
    }
  }

  buildDeleteEndpoints (route, domain, endpoint) {
    if (endpoint.protected) {
      this._apiRoutes.delete(`/${domain}${endpoint.httpRoute}`, this._auth.middleware.validateApi, (req, res) => route[endpoint.handler](req, res))
    } else {
      this._apiRoutes.delete(`/${domain}${endpoint.httpRoute}`, (req, res) => route[endpoint.handler](req, res))
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
            const Route = require(this._path.join(this._dependencies.root, `src/${endpoint.route}`))
            switch (endpoint.method.toLocaleUpperCase()) {
              case 'GET':
                this.buildGetEndpoints(new Route(this._dependencies), domainName, endpoint)
                break
              case 'POST':
                this.buildPostEndpoints(new Route(this._dependencies), domainName, endpoint)
                break
              case 'PUT':
                this.buildPutEndpoints(new Route(this._dependencies), domainName, endpoint)
                break
              case 'PATCH':
                this.buildPatchEnpoints(new Route(this._dependencies), domainName, endpoint)
                break
              case 'DELETE':
                this.buildDeleteEndpoints(new Route(this._dependencies), domainName, endpoint)
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
    this._apiRoutes.get('*', (_req, res) => {
      res.status(404).send('This API is not fully armed and operational... Try another valid route.')
    })
  }
}

module.exports = { ApiManager }
