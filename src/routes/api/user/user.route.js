class UserRoute {
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
    this.EntityController = this._controllers.UserController
  }

  /**
   * @swagger
   * /user/{queryselector}:
   *   get:
   *     summary: Get an user by query selector.
   *     description: Returns the user information that matches the query selector an search specified in the route.
   *     tags:
   *       - Usuarios
   *     parameters:
   *       - in: path
   *         name: queryselector
   *         description: ID del usuario a buscar.
   *         required: true
   *         schema:
   *           enum:
   *              - id
   *              - national-id
   *              - phone
   *              - email
   *              - business
   *       - in: query
   *         name: search
   *         description: Keyword to search for users.
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: OK.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Response'
   *             examples:
   *               Success:
   *                 value:
   *                   status: 200
   *                   success: true
   *                   message: Operation completed successfully
   *                   result:
   *                     $ref: '#/components/schemas/User'
   *       500:
   *         description: Something was wrong while you make this action.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Response'
   *             examples:
   *               Success:
   *                 value:
   *                   status: 500
   *                   success: false
   *                   message: Something was wrong while you make this action
   *                   result: null
   */
  async get ({ params }) {
    try {
      const entityController = new this.EntityController(this._dependencies)
      let response = {}

      switch (params.queryselector) {
        case 'id':
          response = await entityController.getById(params)
          break
        case 'national-id':
          response = await entityController.getByNationalId(params)
          break
        case 'phone':
          response = await entityController.getByPhone(params)
          break
        case 'email':
          response = await entityController.getByEmail(params)
          break
        case 'business-id':
          response = await entityController.getByBusinessId(params)
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
   * Route to get status entity (GET http://<<URL>>/identity/user)
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
   * Route to get status entity (GET http://<<URL>>/identity/user)
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

module.exports = UserRoute
