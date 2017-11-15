function MainServer(dependencies) {
	
		var _app = dependencies.app;
	
		// Modules
		const _cross = dependencies.cross;
		const _console = require('./consoleController')(dependencies);
		const _databaseController = require('./databaseController')(dependencies);
		
	
		var constructor =  (next) => {
			dependencies.console = _console;
	
			_databaseController.Initialize((result) => {
				if (result == true) {
					dependencies.database = _databaseController;
	
					const _apiController = require('./apiController')(dependencies);
					_apiController.Initialize();
					dependencies.api = _apiController;
	
					const _frontendController = require('./frontendController')(dependencies);
					_frontendController.Initialize();
	
					_console.success('Boilerplate', 'Modules initialized');
					next();
				}
				else {
					_console.error('Boilerplate', 'Failed to connect with database');
					process.exit(0);
				}
			});
		}
	
		return {
			Initialize: constructor
		}
	}
	
	module.exports = MainServer;