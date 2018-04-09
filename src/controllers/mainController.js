function mainController (dependencies) {
  // Modules
  const _console = require('./console/consoleController')(dependencies)
  const _databaseController = require('./database/databaseController')(dependencies)

  var constructor = (next) => {
    dependencies.console = _console

    _databaseController.Initialize((result) => {
      if (result === true) {
        dependencies.database = _databaseController

        const _apiController = require('./api/apiManager')(dependencies)
        _apiController.Initialize()
        dependencies.api = _apiController

        const _frontendController = require('./frontend/frontendController')(dependencies)
        _frontendController.Initialize()

        _console.success('Boilerplate', 'Modules initialized')
        next()
      } else {
        _console.error('Boilerplate', 'Failed to connect with database')
        process.exit(0)
      }
    })
  }

  return {
    Initialize: constructor
  }
}

module.exports = mainController
