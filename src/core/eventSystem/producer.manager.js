class EventProducerManager {
  constructor (dependencies) {
    this._dependencies = dependencies
    this._console = this._dependencies.console
    this._path = this._dependencies.path
    this._config = this._dependencies.config
    this._websocketServer = this._dependencies.websocketServer
    this._websocketClientModule = this._dependencies.websocketClientModule
    this._eventSystemDefinition = {}
    this._producer = {}
  }

  setup () {
    if (!this._config.USE_PRODUCER_EVENTS) {
      this._console.info('Event System::[Producer] manager is disabled')
      return
    }

    this._eventSystemDefinition = require(`${this._dependencies.root}/src/events/index`)

    this.#connectToServer()

    this._console.success('Event System::[Producer] manager loaded')
  }

  async #connectToServer () {
    this._producer = this._websocketClientModule.connect(this._config.EVENT_PRODUCER_SERVER_URI, {
      reconnect: true
    })

    this.#loadProducerEvents()
  }

  #loadProducerEvents () {
    this._producer.on('connect', (data) => {
      this._console.success(`Event System::[Producer] connected to broker at ${this._config.EVENT_PRODUCER_SERVER_URI}`)
      this._console.success(`Event System::[Producer] id: ${this.id}`)
    })

    this.#createEvents({ socket: this._producer })

    this._producer.on('disconnect', () => {
      this._console.success(`Event System::[Producer] disconnected ${socket.id}`)
    })
  }

  #createEvents ({ socket }) {
    // build each api routes
    this._eventSystemDefinition.producer.events.map((eventDefinition) => {
      try {
        this._console.success(`Event System::[Producer]Initializing ${eventDefinition.name} event`)

        /* Initialize event in websocket provider */
        socket.on(eventDefinition.name, (data) => {
          if (!data) {
            data = {}
          }

          this.#executeEvent({ eventSettings: eventDefinition, data, socket })
        })
      } catch (error) {
        this._console.error(`Event System::[Producer] Component failed: ${JSON.stringify(eventDefinition)}`, true)
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

    this.definition.events.find(event => event.name === name)
  }

  get definition () {
    return this._eventSystemDefinition.producer
  }

  get producer () {
    return this._producer
  }

  get id () {
    return this._producer.id
  }
}

module.exports = EventProducerManager
