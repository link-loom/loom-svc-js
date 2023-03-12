class UploadRoute {
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
    this.EntityController = this._controllers.UploadController
  }

  /**
   * Route to get status entity (GET http://<<URL>>/file/upload/single)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async upload ({ params, req, res }) {
    try {
      const entityController = new this.EntityController(this._dependencies)

      return entityController.uploadFile(req, res)
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  /**
   * Route to get status entity (GET http://<<URL>>/file/upload/bulk)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async bulk ({ params, req, res }) {
    try {
      const entityController = new this.EntityController(this._dependencies)

      return entityController.bulk(req, res)
    } catch (error) {
      return this._utilities.response.error(error.message)
    }
  }
}

module.exports = UploadRoute
