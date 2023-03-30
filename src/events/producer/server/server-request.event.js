class Event {
  constructor (dependencies, { socket }) {
    /* Base Properties */
    this._dependencies = dependencies
    this._utilities = this._dependencies.utilities
    this._console = this._dependencies.console
    this._websocketServer = this._dependencies.webSocketServer
    this._socket = socket

    /* Custom Properties */
    /* this._myPrivateProperty = 'Some value' */

    /* Assigments */
    /* this._newPrivateObject = new SomeObject(this._dependencies) */
  }

  /**
   * Is executed event when is fired by busEventName
   * @param payload Is the information to work with event {context, command, values}
   */
  async execute ({ settings, payload }) {
    console.log(settings.name, payload)

    // Setup response
    const responsePayload = {
      context: {
        topics: ['server'],
        event: {
          name: 'reversebytes.beat.server'
        },
        socket: {
          id: this._socket.id
        }
      },
      command: '#response',
      values: {}
    }

    this._utilities.event.producer.emit({
      settings,
      payload: responsePayload
    })
  }
}

module.exports = Event