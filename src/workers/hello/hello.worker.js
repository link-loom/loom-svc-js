// src/apps/hello/hello.app.js
/**
 * HelloApp
 * ========
 * Minimal App that extends BaseWorker and exposes a tiny public API.
 * No timers. No assumptions about external infra.
 */

const fs = require('node:fs');
const path = require('node:path');
const { BaseWorker } = require('@link-loom/sdk');

class HelloWorker extends BaseWorker {
  static namespace = '[Worker]::[Hello]';

  constructor(dependencies) {
    super(dependencies);

    this._root = this._dependencies.root;
    this._inboxDir = path.join(this._root, 'runtime', 'hello-inbox');
    this._outDir = path.join(this._root, 'runtime', 'hello-out');

    // OS handle (opened only when ACTIVE_*)
    this._watcher = null;

    // in-memory state
    this._state = {
      createdAt: null,
      lastEventAt: null,
      events: 0,
      activeMode: null, // 'foreground' | 'background' | null
    };
  }

  // -------------------------
  // Lifecycle (override BaseWorker virtuals)
  // -------------------------
  async setup(_ctx) {
    this._state.createdAt = Date.now();
    fs.mkdirSync(this._inboxDir, { recursive: true });
    fs.mkdirSync(this._outDir, { recursive: true });

    // prepare API once
    this.registerApi(this.buildApi());
  }

  async activateForeground(_ctx) {
    await this.#openWatcher();
    this._state.activeMode = 'foreground';
  }

  async activateBackground(_ctx) {
    await this.#openWatcher();
    this._state.activeMode = 'background';
  }

  async deactivate(_ctx) {
    this.#closeWatcher();
    this._state.activeMode = null;
  }

  async suspend(_ctx) {
    this.#closeWatcher();
    this._state.activeMode = null;
  }

  async resume(_ctx) {
    // remain INACTIVE until AppsModule activates again
  }

  async terminate(_ctx) {
    this.#closeWatcher();
  }

  async handleSignal(sig, _ctx) {
    this._console.info('signal received', { namespace: this._namespace, sig });
  }

  // -------------------------
  // Public API
  // -------------------------
  buildApi() {
    return {
      ping: this.ping.bind(this),
      status: this.status.bind(this),
      echo: this.echo.bind(this),
      writeFile: this.writeFile.bind(this),
      readFile: this.readFile.bind(this),
    };
  }

  ping() {
    return 'pong';
  }

  status() {
    return {
      ok: true,
      inboxDir: this._inboxDir,
      outDir: this._outDir,
      watcherOpen: !!this._watcher,
      ...this._state,
    };
  }

  echo(payload) {
    return { ok: true, payload };
  }

  async writeFile(filename, content = '') {
    const target = path.join(this._outDir, String(filename || 'file.txt'));
    await fs.promises.mkdir(path.dirname(target), { recursive: true });
    await fs.promises.writeFile(target, String(content), 'utf8');
    return { ok: true, file: target };
  }

  async readFile(filename) {
    const target = path.join(this._outDir, String(filename || 'file.txt'));
    const data = await fs.promises.readFile(target, 'utf8');
    return { ok: true, file: target, data };
  }

  // -------------------------
  // Internals
  // -------------------------
  async #openWatcher() {
    if (this._watcher) return;
    this._watcher = fs.watch(this._inboxDir, { persistent: true }, (eventType, filename) => {
      this._state.events += 1;
      this._state.lastEventAt = Date.now();
      this._console.info('inbox event', {
        namespace: this._namespace,
        eventType, filename,
      });
    });
  }

  #closeWatcher() {
    try {
      if (this._watcher) this._watcher.close();
    } catch (_e) { /* ignore */ }
    this._watcher = null;
  }
}

module.exports = HelloWorker;
