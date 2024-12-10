class TemplateRoute {
  constructor(dependencies) {
    /* Base Properties */
    this._dependencies = dependencies;
    this._utilities = this._dependencies.utilities;
    this._console = this._dependencies.console;
    this._services = this._dependencies.services;

    /* Custom Properties */
    /* this._myPrivateProperty = 'Some value' */

    /* Assigments */
    /* this._newPrivateObject = new SomeObject(this._dependencies) */
    this.EntityService = this._services.TemplateService;
  }

  /**
   * @swagger
   * /example/template/{queryselector}:
   *   get:
   *     summary: Get an template by query selector.
   *     description: Returns the template information that matches the query selector an search specified in the route.
   *     tags:
   *       - Template
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
   *              - organization-id
   *              - all
   *       - in: query
   *         name: search
   *         description: Keyword to search for entities.
   *         required: false
   *         schema:
   *           type: string
   *       - in: query
   *         name: include_status
   *         description: Optional status parameter to include templates of a specific status.
   *         required: false
   *         schema:
   *           type: string
   *         example: "active,inactive"
   *       - in: query
   *         name: exclude_status
   *         description: Optional status parameter to exclude templates of a specific status.
   *         required: false
   *         schema:
   *           type: string
   *         example: "deleted,blocked"
   *       - in: query
   *         name: skip
   *         description: Number of records to skip for pagination.
   *         required: false
   *         schema:
   *           type: integer
   *         example: 10
   *       - in: query
   *         name: limit
   *         description: Maximum number of records to return.
   *         required: false
   *         schema:
   *           type: integer
   *         example: 50
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
   *                     $ref: '#/components/schemas/Template'
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
  async get({ params }) {
    try {
      const entityService = new this.EntityService(this._dependencies);

      return entityService.get(params);
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  /**
   * @swagger
   * /example/template/:
   *   post:
   *      summary: Create a new template.
   *      description: Returns the created template with data provided.
   *      tags:
   *       - Template
   *      requestBody:
   *        description: Template object to be created.
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Template'
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
   *                     $ref: '#/components/schemas/Template'
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
  async create({ params }) {
    try {
      const entityService = new this.EntityService(this._dependencies);

      return entityService.create(params);
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  /**
   * @swagger
   * /example/template/:
   *   patch:
   *      summary: Update an existing template.
   *      description: Updates the data of an existing template with the data provided.
   *      tags:
   *       - Template
   *      requestBody:
   *        description: Template object to be created.
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Template'
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
   *                     $ref: '#/components/schemas/Template'
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
  async update({ params }) {
    try {
      const entityService = new this.EntityService(this._dependencies);

      return entityService.update(params);
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  /**
   * @swagger
   * /example/template/:
   *   delete:
   *     summary: Delete a template by its id.
   *     description: Deletes a template based on the provided ID.
   *     tags:
   *       - Template
   *     requestBody:
   *       description: ID of the template to delete
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               id:
   *                 type: string
   *             example:
   *               id: ""
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
   *                   message: Template successfully deleted
   *                   result: null
   *       500:
   *         description: Something went wrong while performing this action.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Response'
   *             examples:
   *               Error:
   *                 value:
   *                   status: 500
   *                   success: false
   *                   message: Something went wrong while performing this action
   *                   result: null
   */
  async delete({ params }) {
    try {
      const entityService = new this.EntityService(this._dependencies);
      return entityService.delete(params);
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }
}

module.exports = TemplateRoute;
