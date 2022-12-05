class Event {
  constructor (dependencies, { socket }) {
    /* Base Properties */
    this._dependencies = dependencies
    this._utilities = this._dependencies.utilities
    this._console = this._dependencies.console
    this._socketManager = this._dependencies.socketManager
    this._websocketServer = this._dependencies.websocketServer
    this._brokerManager = this._dependencies.brokerManager
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

    // Get a new event from this broker
    const eventDefinition = this._brokerManager.getEventDefinitionByName('reversebytes.beat.chatbot')

    // Setup the new event topics
    payload.command = '#response'
    payload.context.topics = eventDefinition.topics

    // Emit the event with new target
    this._utilities.event.broker.emit({
      websocketServer: this._websocketServer,
      socket: this._socket,
      settings: eventDefinition,
      payload
    })
  }
}

module.exports = Event
