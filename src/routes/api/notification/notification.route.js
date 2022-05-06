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
    const notificationController = new this._controllers.NotificationController(this._dependencies)
    const params = this._utilities.request.getParameters(req)
    const { id, businessId, receiver, q } = params
    let response = {}

    if (id) {
      response = await notificationController.getById(params)
    } else if (receiver) {
      response = await notificationController.getAllByReceiver(params)
    } else if (businessId) {
      response = await notificationController.getByBusinessId(params)
    } else if (receiver && q.toLocaleLowerCase().includes('folder')) {
      response = await notificationController.getAllGroupedByFoldersAndByReceiver(params)
    } else if (receiver && q.toLocaleLowerCase().includes('last')) {
      response = await notificationController.getAllLastByReceiver(params)
    } else {
      response = await notificationController.getAll(params)
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
