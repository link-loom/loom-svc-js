function server (args) {
  const settings = require('./settings.manager')(args)

  let _console = {}

  const startServer = () => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      settingsInit()

      consoleInit()

      authInit()

      dalInit()

      await databaseInit()

      await storageInit()

      socketSetup()

      await geolocatorInit()

      localizationInit()

      modelsInit()

      controllersInit()

      socketInit()

      functionsInit()

      apiInit()

      frontendInit()

      _console.success('Core modules initialized')

      serverInit()

      resolve(settings.dependencies().get())
    })
  }

  const modelsInit = () => {
    const _modelsManager = require('./model.manager')(settings.dependencies().get())
    settings.dependencies().add(_modelsManager.get(), 'models')
  }

  const dalInit = async () => {
    const DalManager = require('./dal.manager')
    const _dalManager = new DalManager(settings.dependencies().get())
    settings.dependencies().add(_dalManager, 'dal')
  }

  const geolocatorInit = async () => {
    const _geolocatorManager = require('./geolocator.manager')(settings.dependencies().get())
    await _geolocatorManager.start()
    settings.dependencies().add(_geolocatorManager, 'geolocator')
  }

  const localizationInit = () => {
    const _localizationManager = require('./localization.manager')(settings.dependencies().get())
    _localizationManager.start()
    settings.dependencies().add(_localizationManager, 'locale')
  }

  const settingsInit = () => {
    settings.initialize()
    settings.dependencies().add(settings, 'settings')
  }

  const consoleInit = () => {
    _console = require('./console.manager')(settings.dependencies().get())
    settings.dependencies().add(_console, 'console')
  }

  const authInit = () => {
    const _auth = require('./auth.manager')(settings.dependencies().get())
    settings.dependencies().add(_auth, 'auth')
  }

  const databaseInit = () => {
    let _databaseManager = require('./database.manager')(settings.dependencies().get())
    return _databaseManager.initialize()
  }

  const storageInit = () => {
    let _storageManager = require('./storage.manager')(settings.dependencies().get())
    return _storageManager.initialize()
  }

  const controllersInit = () => {
    let _controllersManager = require('./controller.manager')(settings.dependencies().get())
    settings.dependencies().add(_controllersManager, 'controllers')
  }

  const apiInit = () => {
    const _apiManager = require('./api.manager')(settings.dependencies().get())
    _apiManager.start()
    settings.dependencies().add(_apiManager, 'api')
  }

  const frontendInit = () => {
    const _frontendManager = require('./frontend.manager')(settings.dependencies().get())
    _frontendManager.start()
  }

  const functionsInit = () => {
    const _functionsManager = require('./functions.manager')(settings.dependencies().get())
    settings.dependencies().add(_functionsManager, 'functions')
  }

  const socketSetup = () => {
    // Listening and setup socket
    let socket = settings.dependencies().get().socketModule(settings.dependencies().get().httpServer, {})
    socket.origins((origin, callback) => {
      callback(null, true)
    })
    settings.dependencies().add(socket, 'socket')

    const _socketManager = require('./socketManager')(settings.dependencies().get())
    _socketManager.start()
  }

  const socketInit = () => {
    // Initialize socket when controllers are initialized
    let socketController = settings.dependencies().get().controllers.socket
    socketController.initialize()
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
