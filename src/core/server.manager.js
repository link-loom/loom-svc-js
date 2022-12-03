const { SettingsManager } = require('./settings.manager')
const { ConsoleManager } = require('./console.manager')
class ServerManager {
  constructor (args) {
    this._settings = new SettingsManager(args)
    this._console = new ConsoleManager(this._settings.dependencies.core.get())
  }

  async loadServer () {
    try {
      this.registerSettings()

      this.registerConsole()

      this.registerAuth()

      this.registerDal()

      await this.registerDatabase()

      await this.registerStorage()

      await this.registerPushNotifications()

      this.registerModels()

      this.registerControllers()

      this.registerFunctions()

      this.registerApi()

      this.webSocketSetup()

      this._console.success('Server manager loaded')

      this.registerServer()

      this.executeStartupFunctions()

      return this._settings.dependencies.get()
    } catch (error) {
      console.log(error)
      process.exit()
    }
  }

  registerModels () {
    const { ModelManager } = require('./model.manager')
    const _modelsManager = new ModelManager(this._settings.dependencies.get())

    this._settings.dependencies.core.add(_modelsManager.models, 'models')
  }

  async registerDal () {
    const { DalManager } = require('./dal.manager')
    const _dalManager = new DalManager(this._settings.dependencies.get())

    this._settings.dependencies.core.add(_dalManager, 'dal')
  }

  registerSettings () {
    this._settings.dependencies.core.add(this._settings, 'settings')
  }

  registerConsole () {
    this._settings.dependencies.core.add(this._console, 'console')
  }

  registerAuth () {
    const { AuthManager } = require('./auth.manager')
    const _auth = new AuthManager(this._settings.dependencies.get())

    this._settings.dependencies.core.add(_auth, 'auth')
  }

  registerDatabase () {
    const { DatabaseManager } = require('./database.manager')
    const _databaseManager = new DatabaseManager(this._settings.dependencies.get())

    return _databaseManager
  }

  registerStorage () {
    const { StorageManager } = require('./storage.manager')
    const _storageManager = new StorageManager(this._settings.dependencies.get())

    return _storageManager.loadStorage()
  }

  async registerPushNotifications () {
    const { PushManager } = require('./push.manager')
    const _pushManager = new PushManager(this._settings.dependencies.get())
    await _pushManager.loadPushNotifications()

    this._settings.dependencies.core.add(_pushManager.push, 'pushNotificationManager')
  }

  registerControllers () {
    const { ControllerManager } = require('./controller.manager')
    const _controllersManager = new ControllerManager(this._settings.dependencies.get())

    this._settings.dependencies.core.add(_controllersManager.controllers, 'controllers')
  }

  registerApi () {
    const { ApiManager } = require('./api.manager')
    const _apiManager = new ApiManager(this._settings.dependencies.get())

    this._settings.dependencies.core.add(_apiManager, 'apiManager')
  }

  registerFunctions () {
    const { FunctionsManager } = require('./functions.manager')
    const _functionsManager = new FunctionsManager(this._settings.dependencies.get())

    this._settings.dependencies.core.add(_functionsManager.functions, 'functions')
  }

  webSocketSetup () {
    // Listening and setup socket
    const webSocketServer = this._settings.dependencies.get().socketModule(this._settings.dependencies.get().httpServer, {
      cors: {
        origin: '*'
      }
    })
    this._settings.dependencies.core.add(webSocketServer, 'websocketServer')

    const WebSocketManager = require('./websocket.manager')
    const webSocketManager = new WebSocketManager(this._settings.dependencies.get())
    webSocketManager.setup()

    this._settings.dependencies.core.add(webSocketManager, 'socketManager')

    return webSocketManager
  }

  registerServer () {
    // Listening on port
    const port = this.normalizePort(process.env.PORT || this._settings.dependencies.get().config.SERVER_PORT)
    if (port) {
      this._settings.dependencies.get().httpServer.listen(port)
    } else {
      this._console.error('Failed to find a port for this app, please setup on PORT environment variable or default config file')
      process.exit(0)
    }
  }

  executeStartupFunctions () {
    const functions = this._settings.dependencies.core.get().functions.startup
    for (const _function in functions) {
      functions[_function].run()
    }
  }

  normalizePort (val) {
    const port = parseInt(val, 10)

    if (isNaN(port)) return val
    if (port >= 0) return port

    return false
  }

  get settings () {
    return this._settings
  }
}

module.exports = { ServerManager }
