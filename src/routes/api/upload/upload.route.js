class UploadRoute {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies
    this._utilities = this._dependencies.utilities
    this._controllers = this._dependencies.controllers

    /* Custom Properties */
    /* this._myPrivateProperty = 'Some value' */

    /* Assigments */
    /* this._newPrivateObject = new SomeObject(this._dependencies) */
  }

  /**
   * Route to get status entity (GET http://<<URL>>/file/upload/single)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async upload (req, res) {
    const uploadController = new this._controllers.UploadController(this._dependencies)
    let response = {}

    response = await uploadController.uploadFile(req, res)

    res.json(response)
  }

  /**
   * Route to get status entity (GET http://<<URL>>/file/upload/bulk)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async bulk (req, res) {
    try {
      const uploadController = new this._controllers.UploadController(this._dependencies)
      let response = {}

      response = await uploadController.bulk(req, res)

      res.json(response)
    } catch (error) {
      res.json(this._utilities.response.error(error.message))
    }
  }
}

module.exports = UploadRoute
