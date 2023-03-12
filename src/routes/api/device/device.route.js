class DeviceRoute {
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
    this.EntityController = this._controllers.DeviceController
  }

  /**
   * Route to get status entity (GET http://<<URL>>/identity/device)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async get ({ params }) {
    try {
      const entityController = new this.EntityController(this._dependencies)
      let response = {}

      switch (params.queryselector) {
        case 'id':
          response = await entityController.getById(params)
          break
        case 'user-id':
          response = await entityController.getByUserId(params)
          break
        case 'fingerprint':
          response = await entityController.getByFingerprint(params)
          break
        case 'identity':
          response = await entityController.getByIdentity(params)
          break
        default:
          response = this._utilities.response.error('Provide a valid slug to query')
          break
      }

      return response
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  /**
   * Route to get status entity (GET http://<<URL>>/identity/device)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async create ({ params }) {
    try {
      const entityController = new this.EntityController(this._dependencies)

      return entityController.create(params)
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  /**
   * Route to get status entity (GET http://<<URL>>/identity/device)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async update ({ params }) {
    try {
      const entityController = new this.EntityController(this._dependencies)

      return entityController.update(params)
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }
}

module.exports = DeviceRoute
