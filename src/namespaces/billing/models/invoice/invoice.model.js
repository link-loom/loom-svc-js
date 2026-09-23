const { BaseModel, Property } = require('@link-loom/sdk');

/**
 * @swagger
 * components:
 *    schemas:
 *      BillingInvoice:
 *        description: An invoice of the billing namespace.
 *        type: object
 *        required:
 *          - number
 *          - customer
 *          - total
 *        properties:
 *          number:
 *            type: string
 *            description: Invoice number, unique.
 *          customer:
 *            type: string
 *            description: Customer reference.
 *          total:
 *            type: number
 *            description: Invoice total.
 *        example:
 *          number: INV-0001
 *          customer: cus-001
 *          total: 64000
 */
class BillingInvoiceModel extends BaseModel {
  // 1. Class Declaration
  number;
  customer;
  total;

  get entityStatuses() {
    return {
      voided: { id: 3, name: 'voided', title: 'Voided', color: '#b71c1c' },
    };
  }

  static get statuses() {
    return { ...BaseModel.defaultStatuses, ...this.prototype.entityStatuses };
  }

  constructor(args, dependencies) {
    if (!args || !dependencies) {
      throw new Error('Required args and dependencies to build this entity');
    }

    super(dependencies);

    this.initializeBaseProperties(args);
    this.initializeEntityProperties(args);
  }

  initializeEntityProperties(args) {
    // 2. Initialization
    this.number = new Property({ value: args.number, type: this.types.string });
    this.customer = new Property({
      value: args.customer,
      type: this.types.string,
    });
    this.total = new Property({ value: args.total, type: this.types.number });
  }

  get sanitized() {
    return {
      id: this.id?.value,
      status: this.status?.value,
      metadata: this.metadata?.value,
      context: this.context?.value,
      number: this.number?.value,
      customer: this.customer?.value,
      total: this.total?.value,
    };
  }

  get get() {
    return {
      id: this.id?.value,
      created: this.created?.value,
      modified: this.modified?.value,
      deleted: this.deleted?.value,
      status: this.status?.value,
      metadata: this.metadata?.value,
      context: this.context?.value,
      // 3. Getter Return
      number: this.number?.value,
      customer: this.customer?.value,
      total: this.total?.value,
    };
  }
}

module.exports = BillingInvoiceModel;
