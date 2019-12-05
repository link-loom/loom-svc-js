class FrontendManager {
  constructor (dependencies) {
    this._dependencies = dependencies
    this._console = dependencies.console
    this._app = dependencies.express
    this._express = dependencies.expressModule
    this._path = dependencies.path
    this._maintenance = require(`${dependencies.root}/src/routes/frontend/maintenance/maintenance.route`)(dependencies)
    this._router = require(`${dependencies.root}/src/routes/router`)

    this.loadFrontendRoutes()
  }

  loadFrontendRoutes () {
    /// Setup engine for Express
    this._app.set('views', `${this._dependencies.root}/src/views`)
    this._app.set('view engine', 'jsx')
    this._app.engine('jsx', require('express-react-views').createEngine())

    // build each frontend routes
    this._router.frontend.map((component) => {
      try {
        const componentView = require(`${this._dependencies.root}/src${component.route}`)(this._dependencies)

        this._app.get(component.httpRoute, componentView[component.handler])
      } catch (error) {
        this._console.error(`Component failed: ${JSON.stringify(component)}`, true)
      }
    })

    // publish all files under public folder
    this._app.use(this._express.static(this._path.join(this._dependencies.root, '/static/public')))
    this._app.use('/private', this._express.static(this._path.join(this._dependencies.root, '/static/private')))

    this.importCustomStaticRoutes()

    // Something else, 404 error
    this._app.get('*', this._maintenance.index)

    this._app.use((err, req, res, next) => {
      res.redirect(`/maintenance?error=${err.code}&message=${err.message}`)
      next()
    })

    this._console.success('FrontEnd manager loaded')
  }

  importCustomStaticRoutes () {
    const dependencies = this._dependencies.config.CUSTOM_STATIC_ROUTES

    if (!dependencies || !dependencies.length) {
      return
    }

    dependencies.map(customRoute => {
      this._app.use(customRoute.route, this._express.static(this._path.join(this._dependencies.root, customRoute.path)))
    })
  }
}

module.exports = { FrontendManager }
