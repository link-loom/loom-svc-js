class CatalogProductRoute {
  constructor(dependencies) {
    /* Base Properties */
    this._dependencies = dependencies;
    this._utilities = this._dependencies.utilities;
    this._console = this._dependencies.console;
    this._services = this._dependencies.services;

    /* Assigments */
    this.EntityService = this._services.CatalogProductService;
  }

  /**
   * @swagger
   * /product/{queryselector}:
   *   get:
   *     summary: Get products by query selector.
   *     tags:
   *       - Product
   *     parameters:
   *       - in: path
   *         name: queryselector
   *         required: true
   *         schema:
   *           enum:
   *              - id
   *              - sku
   *              - all
   *       - in: query
   *         name: search
   *         required: false
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: OK.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Response'
   */
  async get({ params }) {
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
   * /product/:
   *   post:
   *     summary: Create a product.
   *     tags:
   *       - Product
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CatalogProduct'
   *     responses:
   *       200:
   *         description: OK.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Response'
   */
  async create({ params, principal }) {
    try {
      const entityService = new this.EntityService(this._dependencies);

      return entityService.create({ params, principal });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }
}

module.exports = CatalogProductRoute;
