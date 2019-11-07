function socketController (dependencies) {
  const _eventBus = dependencies.eventBus
  const _console = dependencies.console
  const _socket = dependencies.socket
  const _utilities = dependencies.utilities
  const _controllers = dependencies.controllers

  const _stackeholders = {
    node: { name: 'node' },
    admin: { name: 'admin' },
    client: { name: 'client' }
  }

  // This event is executed when socket is connected to node
  _eventBus.on('initialize-event-engine', () => {
    initialize()
  })

  const initialize = async () => {
    await eventEngine()
  }

  // Implement a selection for event
  const eventEngine = async () => {
    _eventBus.on('node-event', payload => { channelHandler({ payload, stackeholder: _stackeholders.node }) })

    _eventBus.on('admin-event', payload => { channelHandler({ payload, stackeholder: _stackeholders.admin }) })

    _eventBus.on('client-event', payload => { channelHandler({ payload, stackeholder: _stackeholders.client }) })
  }

  const getSocketById = ({ socketId }) => {
    let socket = null

    for (const [key] of Object.entries(_socket.sockets.connected)) {
      if (key === socketId) {
        socket = _socket.sockets.connected[key]
        break
      }
    }

    return socket
  }

  const getFirstSocketByNativeId = () => {
    let nativeSocket = null

    for (const [key] of Object.entries(_socket.sockets.connected)) {
      const client = _socket.sockets.connected[key]
      if (client.nativeId) {
        nativeSocket = client
        break
      }
    }

    return nativeSocket
  }

  const registerNode = (data) => {
    if (!data || !data.context || !data.context.sender || !data.context.sender.socketId || !data.context.nativeId) {
      return
    }

    const socket = getSocketById({
      socketId: data.context.sender.socketId
    })

    socket.nativeId = data.context.nativeId
  }

  const responseSuccess = async (data) => {
    if (!data || !data.context || !data.context || !data.context.receiver) {
      return
    }

    _socket.emit('reversebytes.beat.api', data)
  }

  const botRequest = async (data) => {
    if (!data || !data.values || !data.context) {
      return
    }

    const socket = getFirstSocketByNativeId()

    data.context.receiver = {
      socketId: socket.id,
      nativeId: socket.nativeId
    }
    socket.emit('reversebytes.beat.api', data)
  }

  const getAllNodes = (data) => {
    const nodes = []

    for (var key in _socket.sockets.connected) {
      const client = _socket.sockets.connected[key]

      if (client.nativeId) {
        nodes.push({
          nativeId: client.nativeId,
          socketId: client.id,
          status: client.status || _controllers.job.status.stopped
        })
      }
    }

    data.values = { nodes: nodes }
    data.context.receiver = data.context.sender
    data.command = `${data.command.split('#request')[0]}#response`

    directActionHandler(data)
  }

  const nodeActionHandler = async (payload) => {
    switch (payload.command) {
      case 'qr-bot#response':
      case 'create-bot#response':
      case 'qr-changed#response':
      case 'app-loaded#response':
        responseSuccess(payload)
        break
      case 'register-node#request':
        registerNode(payload)
        break
      default:
        break
    }
  }

  const clientActionHandler = async (payload) => {
    switch (payload.command) {
      case 'create-bot#request':
      case 'qr-bot#request':
        botRequest(payload)
        break
      default:
        break
    }
  }

  const directActionHandler = async (data, type) => {
    if (!data || !data.context || !data.context.sender || !data.context.sender.socketId) {
      return
    }

    if (!type) {
      return
    }

    const socket = getSocketById({
      socketId: data.context.sender.socketId
    })

    socket.emit(type, data)
  }

  const gatewayMessageHandler = async (payload) => {
    switch (payload.command) {
      case 'getAllNodes#request':
        getAllNodes(payload)
        break
      case 'getCurrentJob#response':
      case 'stopCurrentJob#response':
      case 'restartCurrentJob#response':
      case 'scriptFinished#request':
        responseSuccess(payload)
        break
      default:
        break
    }
  }

  const channelHandler = ({ payload, stakeholder }) => {
    if (!payload || !payload.context) {
      _console.error('Event is empty')
      return _utilities.response.error('Please provide a context')
    }

    switch (payload.context.channel.toLocaleLowerCase().trim()) {
      case 'ws':
        webSocketHandler({ payload, stakeholder })
        break
      case 'api':
        apiHandler(payload, stakeholder)
        break
      default:
        break
    }
  }

  const webSocketHandler = ({ payload, stakeholder }) => {
    switch (stakeholder.name.toLocaleLowerCase().trim()) {
      case _stackeholders.node.name.toLocaleLowerCase().trim():
        onNodeEvent(payload)
        break
      case _stackeholders.admin.name.toLocaleLowerCase().trim():
        onAdminEvent(payload)
        break
      case _stackeholders.client.name.toLocaleLowerCase().trim():
        onClientEvent(payload)
        break
      default:
        break
    }
  }

  const apiHandler = ({ payload, stakeholder }) => {
    return _utilities.response.success(payload)
  }

  const onNodeEvent = async (payload) => {
    switch (payload.context.type.toLocaleLowerCase()) {
      case 'direct-action':
        directActionHandler(payload, 'reversebytes.beat.api#node-response')
        break
      case 'gateway-message':
        nodeActionHandler(payload)
        break
      case 'bot-action':
        nodeActionHandler(payload)
        break
      default:
        break
    }
  }

  const onAdminEvent = async (payload) => {
    switch (payload.context.type.toLocaleLowerCase()) {
      case 'direct-message':
        directActionHandler(payload, 'reversebytes.beat.api#admin-request')
        break
      case 'gateway-message':
        gatewayMessageHandler(payload)
        break
      default:
        break
    }
  }

  const onClientEvent = async (payload) => {
    switch (payload.context.type) {
      case 'direct-message':
        directActionHandler(payload, 'reversebytes.beat.api#admin-request')
        break
      case 'client-action':
        clientActionHandler(payload)
        break
      default:
        break
    }
  }

  return {
    initialize,
    eventListening: eventEngine
  }
}

module.exports = socketController
