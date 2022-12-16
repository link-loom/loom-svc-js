class EventBrokerManager {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies
    this._console = this._dependencies.console

    /* Custom Properties */
    this._path = this._dependencies.path
    this._config = this._dependencies.config
    this._websocketServer = this._dependencies.websocketServer
    this._websocketClientModule = this._dependencies.websocketClientModule

    /* Assigments */
    this._namespace = '[Server]::[Event System]::[Broker]'
    this._eventSystemDefinition = {}
  }

  setup () {
    this._console.success('Loading', { namespace: this._namespace })

    this.#loadEvents()

    this._console.success('Loaded', { namespace: this._namespace })
  }

  #loadEvents () {

    if (!this._config.SETTINGS.USE_BROKER_ROLE) {
      this._console.info('Manager is disabled', { namespace: this._namespace })
      return
    }

    this._eventSystemDefinition = require(`${this._dependencies.root}/src/events/index`)

    this._websocketServer.on('connection', (socket) => {
      this.#loadSocketEvents(socket)

      this._console.success(`Producer connected ${socket.id}`, { namespace: this._namespace })
    })
  }

  #loadSocketEvents (socket) {
    this.#subscribeTopics({ socket })
    this.#createEvents({ socket })

    socket.on('disconnect', () => {
      this._console.success(`Producer disconnected ${socket.id}`, { namespace: this._namespace })
    })
  }

  #subscribeTopics ({ socket }) {
    this._console.success(`Initializing topics to ${socket.id}`, { namespace: this._namespace })

    socket.join(this._eventSystemDefinition.broker.topics.map(topic => topic.name))
  }

  #createEvents ({ socket }) {
    // build each api routes
    this._eventSystemDefinition.broker.events.map((eventDefinition) => {
      try {
        this._console.success(`Initializing ${eventDefinition.name} event`, { namespace: this._namespace })

        /* Initialize event in websocket provider */
        socket.on(eventDefinition.name, (data) => {
          if (!data) {
            data = {}
          }

          this.#executeEvent({ eventSettings: eventDefinition, data, socket })
        })
      } catch (error) {
        this._console.error(`Component failed: ${JSON.stringify(eventDefinition)}`, true, { namespace: this._namespace })
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
