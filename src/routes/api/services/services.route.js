class ServicesRoute {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies
    this._utilities = this._dependencies.utilities
    this._console = this._dependencies.console
    this._controllers = this._dependencies.controllers

    /* Custom Properties */
    /* this._myPrivateProperty = 'Some value' */

    /* Assigments */
    /* this._newPrivateObject = new SomeObject(this._dependencies) */
    this.EntityController = this._controllers.ServicesController
  }

  /**
   * Route to get status entity (GET http://<<URL>>/services/backend-uri)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async getBackendUri ({ params }) {
    try {
      const entityController = new this.EntityController(this._dependencies)

      return entityController.getBackendUri(params)
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }
}

module.exports = ServicesRoute
