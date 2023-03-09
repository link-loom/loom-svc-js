const { DependenciesManager } = require('./dependencies.manager')
class ServerManager {
  constructor (args) {
    /* Base Properties */
    this._args = args
    this._dependencies = {}

    /* Assigments */
    this._namespace = '[Server]::[Manager]'
  }

  async load () {
    try {
      console.log(` ${this._namespace}: Loading`)

      this.#setupDependencies()

      this.#setupUtilities()

      this.#setupSettings()

      this.#setupConsole()

      this.#setupEventBus()

      this.#setupAuth()

      this.#setupDal()

      await this.#setupDatabase()

      await this.#setupStorage()

      await this.#setupPushNotifications()

      this.#setupModels()

      this.#setupControllers()

      this.#setupFunctions()

      this.#setupApi()

      this.#setupEventBroker()

      this.#setupEventProducer()

      this.#setupServer()

      this.#serverLoadedTrigger()

      this._dependencies.core.get().console.success('Loaded', { namespace: this._namespace })

      return this._dependencies.core.get()
    } catch (error) {
      console.log(error)
      process.exit()
    }
  }

  #setupDependencies () {
    this._dependencies = new DependenciesManager(this._args)
    this._dependencies.setup()

    this._dependencies.core.add(this._dependencies, 'dependenciesManager')
  }

  #setupUtilities () {
    const { UtilitiesManager } = require('./utilities.manager')
    const utilities = new UtilitiesManager(this._dependencies.core.get())

    this._dependencies.core.add(utilities, 'utilities')
  }

  #setupSettings () {
    const { SettingsManager } = require('./settings.manager')
    this._settings = new SettingsManager(this._dependencies.core.get())
    this._settings.setup()

    this._dependencies.core.add(this._settings, 'settings')
  }

  #setupConsole () {
    const { ConsoleManager } = require('./console.manager')
    this._console = new ConsoleManager(this._dependencies.core.get())
    this._console.setup()

    this._dependencies.core.add(this._console, 'console')
  }

  #setupEventBus () {
    const EventBusManager = require('./eventSystem/bus.manager')
    const eventBus = new EventBusManager(this._dependencies.core.get())
    eventBus.setup()

    this._dependencies.core.add(eventBus, 'eventBus')
  }

  #setupModels () {
    const { ModelManager } = require('./model.manager')
    const modelsManager = new ModelManager(this._dependencies.core.get())
    modelsManager.setup()

    this._dependencies.core.add(modelsManager.models, 'models')
  }

  async #setupDal () {
    const { DalManager } = require('./dal.manager')
    const dalManager = new DalManager(this._dependencies.core.get())
    dalManager.setup()

    this._dependencies.core.add(dalManager, 'dal')
  }

  #setupAuth () {
    const { AuthManager } = require('./auth.manager')
    const authManager = new AuthManager(this._dependencies.core.get())
    authManager.setup()

    this._dependencies.core.add(authManager, 'auth')
  }

  #setupDatabase () {
    const { DatabaseManager } = require('./database.manager')
    const databaseManager = new DatabaseManager({
      dependencies: this._dependencies.core.get(),
      dependencyInjector: this._dependencies
    })
    databaseManager.setup()

    this._dependencies.core.add(databaseManager, 'databaseManager')

    return databaseManager
  }

  #setupStorage () {
    const { StorageManager } = require('./storage.manager')
    const _storageManager = new StorageManager(this._dependencies.core.get())

    return _storageManager.setup()
  }

  async #setupPushNotifications () {
    const { PushManager } = require('./push.manager')
    const pushManager = new PushManager(this._dependencies.core.get())
    await pushManager.setup()

    this._dependencies.core.add(pushManager.push, 'pushNotificationManager')
  }

  #setupControllers () {
    const { ControllerManager } = require('./controller.manager')
    const controllersManager = new ControllerManager(this._dependencies.core.get())
    controllersManager.setup()

    this._dependencies.core.add(controllersManager.controllers, 'controllers')
  }

  #setupApi () {
    const { ApiManager } = require('./api.manager')
    const apiManager = new ApiManager(this._dependencies.core.get())
    apiManager.setup()

    this._dependencies.core.add(apiManager, 'apiManager')
  }

  #setupFunctions () {
    const { FunctionsManager } = require('./functions.manager')
    const _functionsManager = new FunctionsManager(this._dependencies.core.get())

    this._dependencies.core.add(_functionsManager, 'functionsManager')
  }

  #setupEventBroker () {
    // Listening and setup socket
    const webSocketServer = this._dependencies.core.get().socketModule(this._dependencies.core.get().httpServer, {
      cors: {
        origin: '*'
      }
    })
    this._dependencies.core.add(webSocketServer, 'websocketServer')

    const EventBrokerManager = require('./eventSystem/broker.manager')
    const eventBrokerManager = new EventBrokerManager(this._dependencies.core.get())
    eventBrokerManager.setup()

    this._dependencies.core.add(eventBrokerManager, 'brokerManager')

    return eventBrokerManager
  }

  #setupEventProducer () {
    const EventProducerManager = require('./eventSystem/producer.manager')
    const eventProducerManager = new EventProducerManager(this._dependencies.core.get())
    eventProducerManager.setup()

    this._dependencies.core.add(eventProducerManager, 'producerManager')
  }

  #setupServer () {
    // Listening on port
    const port = this.normalizePort(process.env.PORT || this._dependencies.core.get().config.SERVER.PORT)
    if (port) {
      this._dependencies.core.get().httpServer.listen(port)
    } else {
      this._console.error('Failed to find a port for this app, please setup on PORT environment variable or default config file')
      process.exit(0)
    }
  }

  #serverLoadedTrigger () {
    this._dependencies.core.get().eventBus.bus.emit('server::loaded')
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
