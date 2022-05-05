class BackendController {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies
    this._db = dependencies.db
    this._models = dependencies.models
    this._utilities = dependencies.utilities
    this._console = this._dependencies.console
    this._firebase = dependencies.firebaseManager
    this._controllers = this._dependencies.controllers

    /* Custom Properties */
    this._auth = this._dependencies.auth

    /* Assigments */
    this._key = this._auth.crypto.generatePrivateKey(dependencies.config.BACKEND_SECRET)
  }

  get key () {
    return this._key
  }

  get status () {
    return this._models.Backend.statuses
  }
}

module.exports = BackendController
