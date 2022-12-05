class EventUtil {
  constructor (dependencies) {
    this._dependencies = dependencies
  }

  #brokerEmitSingle ({ socket, settings, payload }) {
    socket.emit(settings.name, payload)
  }

  #brokerEmitTopics ({ websocketServer, settings, payload }) {
    for (const topic of payload.context.topics) {
      websocketServer.to(topic).emit(settings.name, payload)
    }
  }

  brokerEmit ({ websocketServer, socket, settings, payload }) {
    if (!payload.context.topics || !payload.context.topics.length) {
      this.#brokerEmitSingle({ socket, settings, payload })

      return
    }

    this.#brokerEmitTopics({ websocketServer, socket, settings, payload })
  }

  get broker () {
    return {
      emit: this.brokerEmit.bind(this)
    }
  }
}

module.exports = EventUtil
