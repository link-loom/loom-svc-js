class BusManager {
  constructor (dependencies) {
    this._dependencies = dependencies
    this._console = this._dependencies.console
    this._events = this._dependencies.events
    this._bus = {}
  }

  setup () {
    this._bus = new this._events.EventEmitter()

    this._console.success('Bus manager loaded')
  }

  get bus () {
    return this._bus
  }
}

module.exports = BusManager
