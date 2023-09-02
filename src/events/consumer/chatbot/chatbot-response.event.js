class Event {
  constructor(dependencies, { socket }) {
    /* Base Properties */
    this._dependencies = dependencies;
    this._utilities = this._dependencies.utilities;
    this._console = this._dependencies.console;
    this._socketManager = this._dependencies.socketManager;
    this._brokerManager = this._dependencies.brokerManager;
    this._socket = socket;

    /* Custom Properties */
    /* this._myPrivateProperty = 'Some value' */

    /* Assigments */
    /* this._newPrivateObject = new SomeObject(this._dependencies) */
  }

  /**
   * Is executed event when is fired by busEventName
   * @param payload Is the information to work with event {context, command, values}
   */
  async execute({ settings, payload }) {
    console.log(settings.name, payload);
  }
}

module.exports = Event;
