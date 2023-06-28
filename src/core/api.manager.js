class ApiManager {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies
    this._console = dependencies.console
    this._utilities = dependencies.utilities

    /* Custom Properties */
    this._config = dependencies.config
    this._app = dependencies.express
    this._express = dependencies.expressModule
    this._swaggerJsdoc = dependencies.swaggerJsdoc
    this._swaggerUi = dependencies.swaggerUi

    /* Assigments */
    this._namespace = '[Server]::[API]::[Manager]'
    this._apiRoutes = this._express.Router()
    this._path = dependencies.path
  }

  setup () {
    this._console.success('Loading', { namespace: this._namespace })

    this.#buildRoutes()

    this._console.success('Loaded', { namespace: this._namespace })
  }

  #handleHttpMethod ({ route, domain, endpoint }) {
    if (endpoint.protected) {
      this._apiRoutes[endpoint.method.toLocaleLowerCase()](
        `/${domain}${endpoint.httpRoute}`,
        this._utilities.validator.api.endpoint,
        (req, res) => this.#handleRoute({ route, domain, endpoint, req, res })
      )
    } else {
      this._apiRoutes[endpoint.method.toLocaleLowerCase()](
        `/${domain}${endpoint.httpRoute}`,
        (req, res) => this.#handleRoute({ route, domain, endpoint, req, res })
      )
    }
  }

  async #handleRoute ({ route, domain, endpoint, req, res }) {
    const params = this._utilities.io.request.getParameters(req)

    const serviceResponse = await route[endpoint.handler]({ params, req, res })

    res.status(serviceResponse.status).json(serviceResponse)
  }

  #buildApiEndpoints () {
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
              endpoint
            })
          } catch (error) {
            this._console.error(`Endpoint failed: ${JSON.stringify(endpoint)}`, true)
          }

          return endpoint
        })
      }
    }

    // All API Rest endpoints are part of the root
    this._app.use('/', this._apiRoutes)
  }

  #buildDocs () {
    const options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: this._config.SERVER.NAME,
          version: this._config.SERVER.VERSION
        },
        servers: [
          {
            url: `http://localhost:${this._config.SERVER.PORT}`,
            description: this._config.SERVER.ID
          }
        ]
      },
      apis: ['src/routes/api/**/*.route.js', 'src/models/**/*.js'],
      customSiteTitle: 'Mi Swagger'
    }

    const specs = this._swaggerJsdoc(options)

    this._app.use('/open-api.playground', this._swaggerUi.serve, this._swaggerUi.setup(specs, {
      customSiteTitle: `${this._config.SERVER.NAME} - ${this._config.SERVER.VERSION}`
    }))
    this._app.get('/open-api.json', (_, res) => {
      res.setHeader('Content-Type', 'application/json')
      res.send(specs)
    })
  }

  #buildRoutes () {
    this.#buildDocs()

    this.#buildApiEndpoints()

    // Something else route response a 404 error
    this._apiRoutes.get('*', (_req, res) => {
      res.status(404).send('This API is not fully armed and operational... Try another valid route.')
    })
  }
}

module.exports = { ApiManager }
