// src/apps/_template/_template.app.js

/**
 * TemplateApp
 * =============
 * Minimal Link Loom App template built on top of BaseApp (SDK).
 *
 * Purpose
 * -------
 * - Demonstrate how to extend BaseApp and expose a public API.
 * - Show how lifecycle hooks are optionally implemented (no-op if omitted).
 *
 * Public API
 * ----------
 *   - ping(): string
 *   - counter(): number
 *   - hello(name?: string): string
 *   - bump(): number                      // simple state mutation without lifecycle change
 *
 * Lifecycle Hooks (optional)
 * --------------------------
 *   setup(ctx)                → prepare lightweight state
 *   activateForeground(ctx)   → open high-priority resources
 *   activateBackground(ctx)   → open background resources
 *   deactivate(ctx)           → drop activity but keep prepared
 *   suspend(ctx)              → release I/O fully (rehydratable)
 *   resume(ctx)               → rehydrate minimal state to return INACTIVE
 *   terminate(ctx)            → final cleanup
 *   handleSignal(sig, ctx)    → handle out-of-band signals
 *
 * Notes
 * -----
 * - You do NOT need to implement every hook; BaseApp provides safe no-ops.
 * - Logging uses the injected ConsoleModule (`this._console`).
 * - `this._namespace` is derived from `static namespace` or class name by BaseApp.
 */

const { BaseApp } = require('@link-loom/sdk');

class TemplateApp extends BaseApp {
  static namespace = '[App]::[Template]';

  constructor (dependencies) {
    super(dependencies);

    /* Base Properties */
    this._dependencies = dependencies;
    this._utilities = this._dependencies.utilities;
    this._console = this._dependencies.console;

    /* Custom Properties */
  }

  /**
   * Expose public API for AppsModule.api('hello_world')
   * Keep functions synchronous where possible for simplicity.
   */
  buildApi () {
    return {
      hello: (name = 'world') => `Hello, ${name}!`,
    };
  }

  // -------------------------
  // Optional: lifecycle hooks
  // -------------------------
  async setup (ctx) {
    this._console.info('setup()', { namespace: this._namespace });
    this._startedAt = Date.now();
  }

  async activateForeground (ctx) {
    this._console.info('activateForeground()', { namespace: this._namespace });
    // e.g., subscribe to a bus, start a foreground server, etc.
  }

  async activateBackground (ctx) {
    this._console.info('activateBackground()', { namespace: this._namespace });
    // e.g., lightweight watchers, background semantics
  }

  async deactivate (ctx) {
    this._console.info('deactivate()', { namespace: this._namespace });
    // close/stop active work but keep the instance prepared (INACTIVE)
  }

  async suspend (ctx) {
    this._console.info('suspend()', { namespace: this._namespace });
    // release I/O completely (files, sockets, subscriptions)
  }

  async resume (ctx) {
    this._console.info('resume()', { namespace: this._namespace });
    // rehydrate minimal state to return to INACTIVE
  }

  async terminate (ctx) {
    this._console.info('terminate()', { namespace: this._namespace });
    // final cleanup; called before TERMINATED (unless force)
  }

  async handleSignal (sig, ctx) {
    // out-of-band signals (no state change enforced by FSM)
    this._console.info('handleSignal()', { namespace: this._namespace, sig });

    if (sig === 'SIGHUP') {
      this._counter = 0;
      this._console.success('Counter reset by SIGHUP', { namespace: this._namespace });
    }
  }
}

module.exports = TemplateApp;
