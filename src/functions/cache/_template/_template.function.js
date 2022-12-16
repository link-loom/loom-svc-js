class Function {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies
    this._utilities = this._dependencies.utilities
    this._console = this._dependencies.console
    this._data = {}

    /* Custom Properties */
    /* this._myPrivateProperty = 'Some value' */

    /* Assigments */
    /* this._newPrivateObject = new SomeObject(this._dependencies) */
  }

  get data () {
    return this._data
  }

  set data (_data) {
    if (!_data) {
      return
    }

    this._data = _data

    _console.success('status are setted succesfully')
  }
}

module.exports = Function
