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
  }

  run () {
    this.getStatus()
  }

  async getStatus () {
    try {
      _console.info('Executing timed function')

      const statusController = new _controllers.Status(this._dependencies)
      const statusResponse = await statusController.get()

      if (_utilities.response.isValid(statusResponse)) {
        this._console.log(statusResponse)
      }
    } catch (error) {
      _console.error(error)
    }
  }
}

module.exports = Function
