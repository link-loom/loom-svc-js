function server (args) {
  const settings = require('./settings')(args)

  const startServer = (next) => {
    settings.initialize()

    const _console = require('./console')(settings.dependencies().get())
    const _databaseController = require('./databaseManager')(settings.dependencies().get())

    settings.dependencies().add(_console, 'console')

    let databaseStatus = _databaseController.Initialize()

    if (databaseStatus === true) {
      settings.dependencies().add(_databaseController, 'database')

      const _apiManager = require('./apiManager')(settings.dependencies().get())
      _apiManager.start()
      settings.dependencies().add(_apiManager, 'api')

      const _frontendManager = require('./frontendManager')(settings.dependencies().get())
      _frontendManager.start()

      _console.success('Modules initialized')

      // Listening on port
      settings.dependencies().get().httpServer.listen(normalizePort(process.env.PORT || settings.dependencies().get().config.SERVER_PORT))

      next(settings.dependencies().get())
    } else {
      _console.error('Failed to connect with database')
      process.exit(0)
    }
  }

  const normalizePort = (val) => {
    var port = parseInt(val, 10)

    if (isNaN(port)) return val
    if (port >= 0) return port
    return false
  }

  const getSettings = () => {
    return settings
  }

  return {
    start: startServer,
    settings: getSettings
  }
}

module.exports = server
