class BillingInvoiceRoute {
  constructor(dependencies) {
    /* Base Properties */
    this._dependencies = dependencies;
    this._utilities = this._dependencies.utilities;
    this._console = this._dependencies.console;
    this._services = this._dependencies.services;

    /* Assigments */
    this.EntityService = this._services.BillingInvoiceService;
  }

  /**
   * @swagger
   * /invoice/{queryselector}:
   *   get:
   *     summary: Get invoices by query selector.
   *     tags:
   *       - Invoice
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: queryselector
   *         required: true
   *         schema:
   *           enum:
   *              - id
   *              - all
   *     responses:
   *       200:
   *         description: OK.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Response'
   */
  async get({ params, principal }) {
    try {
      const entityService = new this.EntityService(this._dependencies);

      return entityService.get({ params, principal });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  /**
   * @swagger
   * /invoice/:
   *   post:
   *     summary: Create an invoice.
   *     tags:
   *       - Invoice
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/BillingInvoice'
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

module.exports = BillingInvoiceRoute;
