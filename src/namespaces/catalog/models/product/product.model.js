const { BaseModel, Property } = require('@link-loom/sdk');

/**
 * @swagger
 * components:
 *    schemas:
 *      CatalogProduct:
 *        description: A product of the catalog namespace.
 *        type: object
 *        required:
 *          - name
 *          - sku
 *        properties:
 *          name:
 *            type: string
 *            description: Product name.
 *          sku:
 *            type: string
 *            description: Stock keeping unit, unique.
 *          price:
 *            type: number
 *            description: Unit price.
 *        example:
 *          name: Coffee beans 500 g
 *          sku: CB-500
 *          price: 32000
 */
class CatalogProductModel extends BaseModel {
  // 1. Class Declaration
  name;
  sku;
  price;

  get entityStatuses() {
    return {
      archived: {
        id: 3,
        name: 'archived',
        title: 'Archived',
        color: '#546e7a',
      },
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
    this.name = new Property({ value: args.name, type: this.types.string });
    this.sku = new Property({ value: args.sku, type: this.types.string });
    this.price = new Property({ value: args.price, type: this.types.number });
  }

  get sanitized() {
    return {
      id: this.id?.value,
      status: this.status?.value,
      metadata: this.metadata?.value,
      context: this.context?.value,
      name: this.name?.value,
      sku: this.sku?.value,
      price: this.price?.value,
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
      name: this.name?.value,
      sku: this.sku?.value,
      price: this.price?.value,
    };
  }
}

module.exports = CatalogProductModel;
