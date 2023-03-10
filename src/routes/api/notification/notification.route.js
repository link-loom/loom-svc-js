class NotificationRoute {
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
   * Route to get status entity (GET http://<<URL>>/communication/notification)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async get (req, res) {
    const entityController = new this._controllers.NotificationController(this._dependencies)
    const params = this._utilities.request.getParameters(req)
    let response = {}

    switch (params.queryselector) {
      case 'id':
        response = await entityController.getById(params)
        break
      case 'receiver':
        response = await entityController.getByReceiverUserId(params)
        break
      case 'business-id':
        response = await entityController.getByBusinessId(params)
        break
      default:
        response = this._utilities.response.error('Provide a valid slug to query')
        break
    }

    res.json(response)
  }

  /**
   * Route to get status entity (GET http://<<URL>>/communication/notification)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async create (req, res) {
    const notificationController = new this._controllers.NotificationController(this._dependencies)
    const params = this._utilities.request.getParameters(req)
    let response = {}

    response = await notificationController.create(params)

    res.json(response)
  }

  /**
   * Route to get status entity (GET http://<<URL>>/communication/notification)
   * @param {*} req Express request
   * @param {*} res Express response
   */
  async update (req, res) {
    const notificationController = new this._controllers.NotificationController(this._dependencies)
    const params = this._utilities.request.getParameters(req)
    let response = {}

    response = await notificationController.update(params)

    res.json(response)
  }
}

module.exports = NotificationRoute
