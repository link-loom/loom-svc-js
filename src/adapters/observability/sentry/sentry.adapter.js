const ObservabilityBase = require('./../base/observability.base');
const Sentry = require('@sentry/node');

class SentryAdapter extends ObservabilityBase {
  constructor (dependencies) {
    super(dependencies);

    this._namespace = '[Loom]::[Observability]::[Sentry]';
    this._config = config;
  }

  /**
   * Initializes the Sentry SDK.
   */
  async setup () {
    try {
      if (!this._config?.dsn) {
        throw new Error('Missing Sentry DSN in configuration');
      }

      Sentry.init({
        dsn: this._config.dsn,
        environment: this._config.environment || 'production',
        tracesSampleRate: this._config.tracesSampleRate || 1.0,
        ...this._config.options,
      });

      this._console.success('Sentry client initialized', { namespace: this._namespace });
    } catch (err) {
      this._console.error('Failed to initialize Sentry client', {
        error: err,
        namespace: this._namespace,
      });
    }
  }

  /**
   * Sends a custom event to Sentry.
   * @param {Object} event - The event payload.
   * @returns {Promise<string|null>} - The event ID or null on failure.
   */
  async capture (event = {}) {
    try {
      const { message, level = 'info', tags = {}, extra = {} } = event;

      if (!message) {
        throw new Error('Missing "message" field in Sentry event');
      }

      const eventId = Sentry.captureMessage(message, {
        level,
        tags,
        extra,
      });

      return eventId;
    } catch (err) {
      this._console.error('Sentry capture failed', {
        error: err,
        event,
        namespace: this._namespace,
      });
      return null;
    }
  }
}

module.exports = SentryAdapter;
