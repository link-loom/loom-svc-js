const ObservabilityBase = require('./../base/observability.base');
const { Vectry } = require('@vectry/node');

class VectryAdapter extends ObservabilityBase {
  constructor (dependencies) {
    super(dependencies);

    /* Base Properties */
    this._dependencies = dependencies;
    this._console = this._dependencies.console;
    this._utilities = this._dependencies.utilities;
    this._db = this._dependencies.db;

    /* Custom Properties */
    this._observabilityModule = this._dependencies.modules?.observability?.sentry || {};
    this._driver = null;

    /* Assigments */
    this._namespace = '[Loom]::[Observability]::[Vectry]';
  }

  /**
   * Initializes the Vectry SDK client.
   */
  async setup ({ settings }) {
    try {
      if (!settings) {
        throw new Error('Vectry configuration missing: apiKey and apiUrl are required');
      }

      this._driver = new Vectry(settings);

      this._console.success('Vectry client initialized', { namespace: this._namespace });

      return this._driver;
    } catch (err) {
      this._console.error('Failed to initialize Vectry client', {
        error: err,
        namespace: this._namespace,
      });
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
