function Socket (dependencies) {
  /// Dependencies
  const _console = dependencies.console
  const _socket = dependencies.socket
  const _eventBus = dependencies.eventBus

  const constructor = () => {
    buildSocketDefinition()
  }

  const buildSocketDefinition = () => {
    /* if (!eventsIsInitialized) {
      _eventBus.emit('initialize-event-engine')
      eventsIsInitialized = true
    } */

    _socket.on('connection', (client) => {
      client.on('reversebytes.beat.api', (data) => {
        _eventBus.emit(
          'admin-event',
          {
            context: data.context || {},
            command: data.command || '',
            values: data.values || {}
          }
        )
      })
      client.on('reversebytes.beat.chatbot', (data) => {
        _eventBus.emit(
          'chatbot-event',
          {
            context: data.context || {},
            command: data.command || '',
            values: data.values || {}
          }
        )
      })
      client.on('reversebytes.beat.client', (data) => {
        _eventBus.emit(
          'client-event',
          {
            context: data.context || {},
            command: data.command || '',
            values: data.values || {}
          }
        )
      })

      client.on('disconnect', () => {
        _console.success(`Node disconnected ${client.id}`)
      })

      _console.success(`Node connected ${client.id}`)
    })

    _console.success('Socket module initialized')
  }

  return {
    start: constructor
  }
}

module.exports = Socket
