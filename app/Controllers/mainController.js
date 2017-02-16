function MainServer(dependencies) {

    var _app;

    // Modules
    var _cross;
    var _console;
    var _frontendController;
    var _routesController;
    var _socketController;
    var _databaseController;

    var constructor = function (callback) {
        _app = dependencies.app;

        /// Own Console declaration
        _console = require('./consoleController')(dependencies);
        _console.Initialize();
        dependencies.console = _console;

        /// Cross declaration
        _cross = dependencies.cross;

        /// Setting up secret for JWT
        _app.set('MainSecretJWT', _cross.GetMainSecretJWT());

        /// Database declaration
        _databaseController = require('./databaseController')(dependencies);
        dependencies.database = _databaseController;

        _databaseController.Initialize(function (result) {
            if (result == true) {

                /// Frontend declaration
                _frontendController = require('./frontendController')(dependencies);

                /// Routes declaration
                _routesController = require('./routesController')(dependencies);

                /// Socket declaration
                _socketController = require('./socketController')(dependencies);

                initializeControllers(callback);

                _console.log('Server initialized', 'server-success');
            }
            else {
                process.exit(0);
            }
        });
    }

    var initializeControllers = function (callback) {
        _routesController.Initialize();
        _frontendController.Initialize();
        _socketController.Initialize();

        _console.log('Modules initialized', 'server-success');
        callback();
    }

    return {
        Initialize: constructor
    }
}

module.exports = MainServer;