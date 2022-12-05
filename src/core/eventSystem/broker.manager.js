class EventBrokerManager {
  constructor (dependencies) {
    this._dependencies = dependencies
    this._console = this._dependencies.console
    this._path = this._dependencies.path
    this._config = this._dependencies.config
    this._websocketServer = this._dependencies.websocketServer
    this._websocketClientModule = this._dependencies.websocketClientModule
    this._eventSystemDefinition = {}
  }

  setup () {
    if (!this._config.USE_BROKER_EVENTS) {
      this._console.info('Event System::[Broker] manager is disabled')
      return
    }

    this._eventSystemDefinition = require(`${this._dependencies.root}/src/events/index`)

    this.#loadBrokerEvents()

    this._console.success('Event System::[Broker] Broker manager loaded')
  }

  #loadBrokerEvents () {
    this._websocketServer.on('connection', (socket) => {
      this.#loadSocketEvents(socket)

      this._console.success(`Event System::[Broker] Producer connected ${socket.id}`)
    })
  }

  #loadSocketEvents (socket) {
    this.#subscribeTopics({ socket })
    this.#createEvents({ socket })

    socket.on('disconnect', () => {
      this._console.success(`Event System::[Broker] Producer disconnected ${socket.id}`)
    })
  }

  #subscribeTopics ({ socket }) {
    this._console.success(`Event System::[Broker] Initializing topics to ${socket.id}`)

    socket.join(this._eventSystemDefinition.broker.topics.map(topic => topic.name))
  }

  #createEvents ({ socket }) {
    // build each api routes
    this._eventSystemDefinition.broker.events.map((eventDefinition) => {
      try {
        this._console.success(`Event System::[Broker] Initializing ${eventDefinition.name} event`)

        /* Initialize event in websocket provider */
        socket.on(eventDefinition.name, (data) => {
          if (!data) {
            data = {}
          }

          this.#executeEvent({ eventSettings: eventDefinition, data, socket })
        })
      } catch (error) {
        this._console.error(`Event System::[Broker] Component failed: ${JSON.stringify(eventDefinition)}`, true)
        this._console.error(error)
      }
    })
  }

  #executeEvent ({ eventSettings, data, socket }) {
    if (!eventSettings || !eventSettings.filename) {
      return
    }

    /* Setup config */
    const pathname = this._path.join(this._dependencies.root, 'src', eventSettings.filename)

    /* Setup event */
    const Event = require(pathname)
    const event = new Event(this._dependencies, { socket })

    event.execute({
      settings: eventSettings,
      payload: {
        context: data.context || {
          event: {
            name: eventSettings.name
          },
          socket: {
            id: socket.id,
          },
          topics: eventSettings.topics
        },
        command: data.command || '',
        values: data.values || {}
      }
    })
  }

  getEventDefinitionByName (name) {
    if (!name) {
      return
    }

    return this.definition.events.find(event => event.name === name)
  }

  get definition () {
    return this._eventSystemDefinition.broker
  }
}

module.exports = EventBrokerManager
