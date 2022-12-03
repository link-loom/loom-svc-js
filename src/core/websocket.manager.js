class WebSocketManager {
  constructor (dependencies) {
    this._dependencies = dependencies
    this._console = this._dependencies.console
    this._path = this._dependencies.path
    this._websocketServer = this._dependencies.websocketServer
    this._eventBus = this._dependencies.eventBus
    this._eventList = require(`${this._dependencies.root}/src/events/index`)
    this._events = {}
  }

  setup () {
    this.#loadServerEvents()
    this._console.success('Socket manager loaded')
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

  #createEvents ({ socket }) {
    // build each api routes
    this._eventList.events.map((eventDefinition) => {
      try {
        this._console.success(`Initializing ${eventDefinition.name} event`)

        /* Initialize event in websocket provider */
        socket.on(eventDefinition.name, (data) => {
          if (!data) {
            data = {}
          }

          this.#executeEvent({ eventSettings: eventDefinition, data, socket })
        })
      } catch (error) {
        this._console.error(`Component failed: ${JSON.stringify(eventDefinition)}`, true)
        this._console.error(error)
      }
    })
  }

  #subscribeTopics ({ socket }) {
    this._console.success(`Initializing topics to ${socket.id}`)

    socket.join(this._eventList.topics.map(topic => topic.name))
  }

  #loadServerEvents () {
    this._websocketServer.on('connection', (socket) => {
      this.#loadSocketEvents(socket)

      this._console.success(`Node connected ${socket.id}`)
    })
  }

  #loadSocketEvents (socket) {
    this.#subscribeTopics({ socket })
    this.#createEvents({ socket })

    socket.on('disconnect', () => {
      this._console.success(`Node disconnected ${socket.id}`)
    })
  }

  #emitSingle ({ socket, settings, payload }) {
    socket.emit(settings.name, payload)
  }

  #emitQueues ({ settings, payload }) {
    for (const topic of payload.context.topics) {
      this._websocketServer.to(topic).emit(settings.name, payload)
    }
  }

  emit ({ socket, settings, payload }) {
    if (!payload.context.topics || !payload.context.topics.length) {
      this.#emitSingle({ socket, settings, payload })

      return
    }

    this.#emitQueues({ socket, settings, payload })
  }

  get events () {
    return this._events
  }
}

module.exports = WebSocketManager
