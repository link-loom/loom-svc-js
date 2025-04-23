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
  async setup ({adapter}) {
    try {
      if (!adapter) {
        throw new Error('Sentry configuration missing');
      }

      const { settings } = adapter;

      Sentry.init({
        dsn: settings.dsn,
        environment: settings.environment || 'production',
        tracesSampleRate: settings.tracesSampleRate || 1.0,
        ...settings.options,
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
