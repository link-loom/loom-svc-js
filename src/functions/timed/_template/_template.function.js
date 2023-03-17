class Function {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies
    this._utilities = this._dependencies.utilities
    this._console = this._dependencies.console

    /* Custom Properties */
    /* this._myPrivateProperty = 'Some value' */

    /* Assigments */
    /* this._newPrivateObject = new SomeObject(this._dependencies) */
    this._namespace = '[Function]::[Timed]::[_Template]'
  }

  run () {
    this.getStatus()
  }

  async getStatus () {
    try {
      _console.info('Executing timed function')

      const statusService = new _services.Status(this._dependencies)
      const statusResponse = await statusService.get()

      if (_utilities.response.isValid(statusResponse)) {
        this._console.log(statusResponse, { namespace: this._namespace })
      }
    } catch (error) {
      _console.error(error)
    }
  }
}

module.exports = Function
