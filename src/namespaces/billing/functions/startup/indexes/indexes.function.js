/**
 * Declares the indexes of the billing database on boot. `createIndexes` is
 * idempotent, so it runs on every start.
 */
class BillingIndexesFunction {
  constructor(dependencies) {
    /* Base Properties */
    this._dependencies = dependencies;
    this._console = this._dependencies.console;
    this._database = this._dependencies?.database?.default?.adapter;

    /* Custom Properties */
    this._databaseName = 'billing';
    this._namespace = '[Function]::[Startup]::[Indexes]';
  }

  async run() {
    if (!this._database || typeof this._database.createIndexes !== 'function') {
      this._console.info(
        'Index declaration not supported by this database adapter',
        { namespace: this._namespace },
      );
      return;
    }

    const created = await this._database.createIndexes({
      tableName: 'invoice',
      databaseName: this._databaseName,
      specs: [
        { key: { number: 1 }, name: 'invoice_number_unique', unique: true },
        { key: { customer: 1, created: -1 }, name: 'invoice_customer_created' },
      ],
    });

    this._console.info(`Indexes ready: ${JSON.stringify(created)}`, {
      namespace: this._namespace,
    });
  }
}

module.exports = BillingIndexesFunction;
