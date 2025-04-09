class ObservabilityBase {
  constructor(dependencies) {
    if (!dependencies) {
      throw new Error('Required dependencies to register this adapter');
    }

    /* Base Properties */
    this._dependencies = dependencies;
    this._console = dependencies.console;
    this._utilities = dependencies.utilities;
    this._observabilityModule = dependencies?.modules?.observability;

  }

  /**
   * Sets up the observability adapter.
   * Must be implemented by concrete classes.
   */
  async setup() {
    throw new Error('setup() must be implemented by the subclass');
  }

  /**
   * Captures an event for observability tracking.
   * Must be implemented by concrete classes.
   * @param {Object} event - The event payload.
   */
  async capture(event = {}) {
    throw new Error('capture() must be implemented by the subclass');
  }
}

module.exports = ObservabilityBase;
