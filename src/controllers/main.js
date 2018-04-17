function mainController (dependencies) {
  // Modules
  const _console = require('./console/consoleController')(dependencies)
  const _databaseController = require('./database/databaseController')(dependencies)

  var constructor = (next) => {
    dependencies.console = _console

    _databaseController.Initialize((result) => {
      if (result === true) {
        dependencies.database = _databaseController

        const _apiManager = require('./api/apiManager')(dependencies)
        _apiManager.start()
        dependencies.api = _apiManager

        const _frontendManager = require('./frontend/frontendManager')(dependencies)
        _frontendManager.start()

        _console.success('Modules initialized')
        next()
      } else {
        _console.error('Failed to connect with database')
        process.exit(0)
      }
    })
  }

  return {
    start: constructor
  }
}

module.exports = mainController
