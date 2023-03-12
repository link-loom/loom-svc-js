class ApiManager {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies
    this._console = dependencies.console
    this._utilities = dependencies.utilities

    /* Custom Properties */
    this._app = dependencies.express
    this._express = dependencies.expressModule
    this._auth = dependencies.auth
    this._storage = dependencies.storage

    /* Assigments */
    this._namespace = '[Server]::[API]::[Manager]'
    this._apiRoutes = this._express.Router()
    this._path = dependencies.path
  }

  setup () {
    this._console.success('Loading', { namespace: this._namespace })

    this.#createEndpoints()

    this._console.success('Loaded', { namespace: this._namespace })
  }

  #handleHttpMethod ({ route, domain, endpoint }) {
    if (endpoint.protected) {
      this._apiRoutes[endpoint.method.toLocaleLowerCase()](
        `/${domain}${endpoint.httpRoute}`,
        this._auth.middleware.validateApi,
        (req, res) => this.#handleRoute({ route, endpoint, req, res })
      )
    } else {
      this._apiRoutes[endpoint.method.toLocaleLowerCase()](
        `/${domain}${endpoint.httpRoute}`,
        (req, res) => this.#handleRoute({ route, endpoint, req, res })
      )
    }
  }

  async #handleRoute ({ route, endpoint, req, res }) {
    const params = this._utilities.request.getParameters(req)
    const serviceResponse = await route[endpoint.handler]({ params, req, res })

    res.status(serviceResponse.status).json(serviceResponse)
  }

  #createEndpoints () {
    const router = require(this._path.join(this._dependencies.root, 'src', 'routes', 'router'))

    // Iterate over domain inside router file and try to build all API Rest routes
    for (const domainName in router) {
      if (Object.hasOwnProperty.call(router, domainName)) {
        const domain = router[domainName]

        domain.map((endpoint) => {
          try {
            const Route = require(this._path.join(this._dependencies.root, `src/${endpoint.route}`))

            this.#handleHttpMethod({
              route: new Route(this._dependencies),
              domain: domainName,
              endpoint: endpoint
            })
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
