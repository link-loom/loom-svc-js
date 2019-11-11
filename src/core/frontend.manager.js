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
      const componentView = require(`${this._dependencies.root}/src${component.route}`)(this._dependencies)

      this._app.get(component.httpRoute, componentView[component.handler])
    })

    // publish all files under public folder
    this._app.use(this._express.static(this._path.join(this._dependencies.root, '/static/public')))
    this._app.use('/private', this._express.static(this._path.join(this._dependencies.root, '/static/private')))
    this._app.use('/jquery', this._express.static(this._path.join(this._dependencies.root, '/node_modules/jquery/dist/')))
    this._app.use('/bootstrap', this._express.static(this._path.join(this._dependencies.root, '/node_modules/bootstrap/dist/')))
    this._app.use('/fontawesome', this._express.static(this._path.join(this._dependencies.root, '/node_modules/@fortawesome/fontawesome-free-webfonts/')))
    this._app.use('/popperjs', this._express.static(this._path.join(this._dependencies.root, '/node_modules/popper.js/dist/')))
    this._app.use('/sweetalert2', this._express.static(this._path.join(this._dependencies.root, '/node_modules/sweetalert2/dist/')))
    this._app.use('/vue', this._express.static(this._path.join(this._dependencies.root, '/node_modules/vue/dist')))
    this._app.use('/vue-resource', this._express.static(this._path.join(this._dependencies.root, '/node_modules/vue-resource/dist')))
    this._app.use('/vue-cookies', this._express.static(this._path.join(this._dependencies.root, '/node_modules/vue-cookies/')))

    // Something else, 404 error
    this._app.get('*', this._maintenance.index)

    this._console.success('FrontEnd manager loaded')
  }
}

module.exports = { FrontendManager }
