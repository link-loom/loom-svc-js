class UploadRoute {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies;
    this._utilities = this._dependencies.utilities;
    this._console = this._dependencies.console;
    this._services = this._dependencies.services;

    /* Custom Properties */
    /* this._myPrivateProperty = 'Some value' */

    /* Assigments */
    /* this._newPrivateObject = new SomeObject(this._dependencies) */
    this.EntityService = this._services.UploadService;
  }

  /**
   * Route to get status entity (GET http://<<URL>>/file/upload/single)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async uploadFile ({ params, req, res }) {
    try {
      const entityService = new this.EntityService(this._dependencies);

      return entityService.uploadFile({ req, res, params });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  /**
   * Route to get status entity (GET http://<<URL>>/file/upload/bulk)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async bulk ({ params, req, res }) {
    try {
      const entityService = new this.EntityService(this._dependencies);

      return entityService.bulk({ req, res, params });
    } catch (error) {
      return this._utilities.io.response.error(error.message);
    }
  }
}

module.exports = UploadRoute;
