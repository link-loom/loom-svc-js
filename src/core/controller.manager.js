class ControllerManager {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies
    this._console = dependencies.console

    /* Custom Properties */

    /* Assigments */
    this._namespace = '[Server]::[Controller]::[Manager]'
  }

  setup () {
    this._console.success('Loading', { namespace: this._namespace })

    this.#loadControllers()

    this._console.success('Loaded', { namespace: this._namespace })
  }

  #loadControllers () {
    this._controllers = require(`${this._dependencies.root}/src/controllers/index`)
  }

  get controllers () {
    return this._controllers
  }
}

module.exports = { ControllerManager }
