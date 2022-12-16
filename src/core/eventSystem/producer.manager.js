class EventProducerManager {
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
    this._namespace = '[Server]::[Event System]::[Producer]'
    this._eventSystemDefinition = {}
    this._producer = {}
  }

  setup () {
    this._console.success('Loading', { namespace: this._namespace })

    this.#connectToServer()

    this._console.success('Loaded', { namespace: this._namespace })
  }

  async #connectToServer () {
    if (!this._config.SETTINGS.USE_PRODUCER_ROLE) {
      this._console.info('Manager is disabled', { namespace: this._namespace })
      return
    }

    this._producer = this._websocketClientModule.connect(this._config.SERVICES.BROKER.URI, {
      reconnect: true
    })

    this.#loadProducerEvents()
  }

  #loadProducerEvents () {
    this._producer.on('connect', (data) => {
      this._console.success(`connected to broker at ${this._config.SERVICES.BROKER.URI}`, { namespace: this._namespace })
      this._console.success(`id: ${this.id}`, { namespace: this._namespace })
    })

    this.#createEvents({ socket: this._producer })

    this._producer.on('disconnect', () => {
      this._console.success(`disconnected from producer`, { namespace: this._namespace })
    })
  }

  #createEvents ({ socket }) {
    this._eventSystemDefinition = require(`${this._dependencies.root}/src/events/index`)

    // build each api routes
    this._eventSystemDefinition.producer.events.map((eventDefinition) => {
      try {
        this._console.info(`Initializing ${eventDefinition.name}${eventDefinition.command} event`, { namespace: this._namespace })

        /* Initialize event in websocket provider */
        socket.on(eventDefinition.name + eventDefinition.command, (data) => {
          if (!data) {
            data = {}
          }

          this.#executeEvent({ eventSettings: eventDefinition, data, socket })
        })
      } catch (error) {
        this._console.error(`Component failed: ${JSON.stringify(eventDefinition)}`, true, { namespace: this._namespace })
        this._console.error(error, { namespace: this._namespace })
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
