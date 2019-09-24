function FrontEnd (dependencies) {
  const maintenance = require(`${dependencies.root}/src/routes/frontend/maintenance/maintenance.route`)(dependencies)
  const router = require(`${dependencies.root}/src/routes/router`)

  /// Dependencies
  const _console = dependencies.console
  const _app = dependencies.httpServer
  const _express = dependencies.express
  const _path = dependencies.path

  const constructor = () => {
    buildFrontendViews()
  }

  const buildFrontendViews = () => {
    /// Setup engine for Express
    _app.set('views', `${dependencies.root}/src/views`)
    _app.set('view engine', 'jsx')
    _app.engine('jsx', require('express-react-views').createEngine())

    // build each frontend routes
    router.frontend.map((component) => {
      let componentView = require(`${dependencies.root}/src${component.route}`)(dependencies)

      _app.get(component.httpRoute, componentView[component.handler])
    })

    // publish all files under public folder
    _app.use(_express.static(_path.join(dependencies.root, '/static/public')))
    _app.use('/private', _express.static(_path.join(dependencies.root, '/static/private')))
    _app.use('/jquery', _express.static(_path.join(dependencies.root, '/node_modules/jquery/dist/')))
    _app.use('/bootstrap', _express.static(_path.join(dependencies.root, '/node_modules/bootstrap/dist/')))
    _app.use('/fontawesome', _express.static(_path.join(dependencies.root, '/node_modules/@fortawesome/fontawesome-free-webfonts/')))
    _app.use('/popperjs', _express.static(_path.join(dependencies.root, '/node_modules/popper.js/dist/')))
    _app.use('/sweetalert2', _express.static(_path.join(dependencies.root, '/node_modules/sweetalert2/dist/')))
    _app.use('/vue', _express.static(_path.join(dependencies.root, '/node_modules/vue/dist')))
    _app.use('/vue-resource', _express.static(_path.join(dependencies.root, '/node_modules/vue-resource/dist')))
    _app.use('/vue-cookies', _express.static(_path.join(dependencies.root, '/node_modules/vue-cookies/')))

    // Something else, 404 error
    _app.get('*', maintenance.index)

    _console.success('FrontEnd module initialized')
  }

  return {
    start: constructor
  }
}

module.exports = FrontEnd
