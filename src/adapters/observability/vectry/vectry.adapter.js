const ObservabilityBase = require('./../base/observability.base');
const { Vectry } = require('@vectry/node');

class VectryAdapter extends ObservabilityBase {
  constructor (dependencies) {
    super(dependencies);

    /* Base Properties */
    this._dependencies = dependencies;
    this._console = this._dependencies.console;
    this._utilities = this._dependencies.utilities;
    this._database = this._dependencies?.database?.default?.client;

    /* Custom Properties */
    this._observabilityModule = this._dependencies.modules?.observability?.sentry || {};
    this._driver = null;

    /* Assigments */
    this._namespace = '[Loom]::[Observability]::[Vectry]';
  }

  /**
   * Initializes the Vectry SDK client.
   */
  async setup ({ adapter }) {
    try {
      if (!adapter) {
        throw new Error('Vectry configuration missing');
      }

      const { settings } = adapter;

      this._driver = new Vectry(settings);

      this._console.success('Client initialized', { namespace: this._namespace });

      return this._driver;
    } catch (err) {
      this._console.error('Error setting up Module', { namespace: this._namespace });
      console.error(error);
    }
  }

  /**
   * Sends an event to Vectry.
   * @param {Object} event - The event payload.
   * @returns {Promise<Object|null>} - The result or null on error.
   */
  async capture (event = {}) {
    try {
      if (!this._observabilityModule?.client) {
        throw new Error('Vectry client is not initialized');
      }

      if (!this._observabilityModule?.client?.capture) {
        throw new Error('Vectry client is not initialized');
      }

      return await this._observabilityModule?.client?.capture(event);
    } catch (err) {
      this._console.error('Vectry capture failed', {
        error: err,
        event,
        namespace: this._namespace,
      });
      return null;
    }
  }
}

module.exports = VectryAdapter;
