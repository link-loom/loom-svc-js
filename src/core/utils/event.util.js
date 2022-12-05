class EventUtil {
  constructor (dependencies) {
    this._dependencies = dependencies
  }

  brokerEmitToSocket ({ socket, settings, payload }) {
    socket.emit(settings.name, payload)
  }

  brokerEmitToTopics ({ websocketServer, settings, payload }) {
    if (!payload.context.topics || !payload.context.topics.length) {
      payload.context.topics = settings.topics
    }

    for (const topic of payload.context.topics) {
      websocketServer.to(topic).emit(settings.name, payload)
    }
  }

  brokerEmit ({ websocketServer, socket, settings, payload }) {
    if (!socket) {
      this.brokerEmitToTopics({ websocketServer, settings, payload })
      return
    }

    this.brokerEmitToSocket({ socket, settings, payload })
  }

  get broker () {
    return {
      emit: this.brokerEmit.bind(this),
      socket: {
        emit: this.brokerEmitToSocket.bind(this)
      },
      topic: {
        emit: this.brokerEmitToTopics.bind(this)
      }
    }
  }
}

module.exports = EventUtil
