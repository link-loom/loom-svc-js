function server (args) {
  const settings = require('./settings')(args)

  let _console = {}

  const startServer = (next) => {
    settingsInit()

    consoleInit()

    authInit()

    let databaseStatus = databaseInit()

    if (databaseStatus === true) {
      controllersInit()

      apiInit()

      frontendInit()

      _console.success('Core modules initialized')

      serverInit()

      next(settings.dependencies().get())
    } else {
      _console.error('Failed to connect with database or you have not any controller defined, you can disable this module')
      process.exit(0)
    }
  }

  const settingsInit = () => {
    settings.initialize()
    settings.dependencies().add(settings, 'settings')
  }

  const consoleInit = () => {
    _console = require('./console')(settings.dependencies().get())
    settings.dependencies().add(_console, 'console')
  }

  const authInit = () => {
    const _auth = require('./auth')(settings.dependencies().get())
    settings.dependencies().add(_auth, 'auth')
  }

  const databaseInit = () => {
    let _databaseController = require('./databaseManager')(settings.dependencies().get())
    return _databaseController.initialize()
  }

  const controllersInit = () => {
    let _controllersManager = require('./controllerManager')(settings.dependencies().get())
    settings.dependencies().add(_controllersManager, 'controllers')
  }

  const apiInit = () => {
    const _apiManager = require('./apiManager')(settings.dependencies().get())
    _apiManager.start()
    settings.dependencies().add(_apiManager, 'api')
  }

  const frontendInit = () => {
    const _frontendManager = require('./frontendManager')(settings.dependencies().get())
    _frontendManager.start()
  }

  const serverInit = () => {
    // Listening on port
    let port = normalizePort(process.env.PORT || settings.dependencies().get().config.SERVER_PORT)
    if (port) {
      settings.dependencies().get().httpServer.listen(port)
    } else {
      _console.error('Failed to find a port for this app, please setup on PORT environment variable or default config file')
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
