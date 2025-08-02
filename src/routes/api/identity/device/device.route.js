class DeviceRoute {
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
    this.EntityService = this._services.DeviceService;
  }

  /**
   * @swagger
   * /identity/device/{queryselector}:
   *   get:
   *     summary: Get an device by query selector.
   *     description: Returns the device information that matches the query selector an search specified in the route.
   *     tags:
   *       - Device
   *     parameters:
   *       - in: path
   *         name: queryselector
   *         description: Is the filter available for this query
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
   *         description: Keyword to search for entities.
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
   *                     $ref: '#/components/schemas/Device'
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
      const entityService = new this.EntityService(this._dependencies);

      return entityService.get({ params });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  /**
   * @swagger
   * /identity/device/:
   *   post:
   *      summary: Create a new device.
   *      description: Returns the created device with data provided.
   *      tags:
   *        - Device
   *      requestBody:
   *        description: Device object to be created.
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Device'
   *      responses:
   *        200:
   *          description: OK.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/Response'
   *              examples:
   *                Success:
   *                  value:
   *                   status: 200
   *                   success: true
   *                   message: Operation completed successfully
   *                   result:
   *                     $ref: '#/components/schemas/Device'
   *        500:
   *          description: Something was wrong while you make this action.
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/Response'
   *              examples:
   *                Success:
   *                  value:
   *                   status: 500
   *                   success: false
   *                   message: Something was wrong while you make this action
   *                   result: null
   */
  async create ({ params }) {
    try {
      const entityService = new this.EntityService(this._dependencies);

      return entityService.create({ params });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  /**
   * @swagger
   * /identity/device/:
   *   patch:
   *      summary: Update an existing device.
   *      description: Updates the data of an existing device with the data provided.
   *      tags:
   *       - Device
   *      requestBody:
   *        description: Device object to be created.
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Device'
   *      responses:
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
   *                     $ref: '#/components/schemas/Device'
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
  async update ({ params }) {
    try {
      const entityService = new this.EntityService(this._dependencies);

      return entityService.update({ params });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }
}

module.exports = DeviceRoute;
