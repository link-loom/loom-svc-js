function FrontEnd(dependencies) {
  const maintenance = require(`${dependencies.root}/src/routes/frontend/maintenance/maintenance.route`)(dependencies);

  const components = require(`${dependencies.root}/src/manage/components`);

  /// Dependencies
  const _console = dependencies.console;
  const _app = dependencies.httpServer;
  const _express = dependencies.express;
  const _path = dependencies.path;

  const constructor = () => {
    buildFrontendViews();
  }

  const buildFrontendViews = () => {
    /// Setup React engine for Express
    _app.set('views', `${dependencies.root}/src/views`);
    _app.set('view engine', 'jsx');
    _app.engine('jsx', require('express-react-views').createEngine());

    // Build every frontend route
    components.frontend.map((component) => {
      let componentView = require(`${dependencies.root}/src/routes/frontend${component.view}`)(dependencies);

      _app.get(component.route, componentView[component.action]);
    })

    // publish all files under public folder
    _app.use(_express.static(_path.join(dependencies.root, '/public')));

    // Something else, 404 error
    _app.get('*', maintenance.index);

    _console.success('Boilerplate', 'FrontEnd module initialized');
  }

  return {
    Initialize: constructor
  }
}

module.exports = FrontEnd;
