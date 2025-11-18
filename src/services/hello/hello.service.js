// src/services/hello.service.js
class HelloService {
  constructor (dependencies) {
    this._dependencies = dependencies;
    this._database = this._dependencies?.database?.default?.adapter;
    this._models = dependencies.models;
    this._utilities = dependencies.utilities;
    this._console = this._dependencies.console;
    this._services = this._dependencies.services;

    this._apps = dependencies.AppsModule;
    this._name = 'hello';
  }

  #ok (result) { return this._u.io.response.success(result); }

  #alias (params) {
    const a = params?.alias;
    if (a) return a;
    const list = this._apps.getAliases(this._name);
    if (list.length === 1) return list[0];
    if (list.length === 0) throw new Error(`No instances for "${this._name}"`);
    throw new Error(`Multiple instances for "${this._name}". Provide alias: ${list.join(', ')}`);
  }

  async ping ({ params }) {
    try {
      const api = this._apps.api(this._name, this.#alias(params));
      const pong = api.ping()

      return this._utilities.io.response.success(pong);
    } catch (e) {
      debugger
      return this._utilities.io.response.error();
    }
  }

  async status ({ params }) {
    try {
      const alias = this.#alias(params);
      return this._utilities.io.response.success(this._apps.status(this._name, alias));
    } catch (e) {
      
      return this._utilities.io.response.error();
    }
  }

  async echo ({ params }) {
    try {
      const api = this._apps.api(this._name, this.#alias(params));
      return this.#ok(api.echo(params?.payload));
    } catch (e) {
      
      return this._utilities.io.response.error();
    }
  }

  async write ({ params }) {
    try {
      const { filename, content } = params || {};
      if (!filename) {
        return this._console.error('filename is required');
      }
      const api = this._apps.api(this._name, this.#alias(params));
      const result = await api.writeFile(filename, content ?? '');
      return this.#ok(result);
    } catch (e) {
      
      return this._utilities.io.response.error();
    }
  }

  async read ({ params }) {
    try {
      const { filename } = params || {};
      if (!filename) {
        this._console.error('filename is required');
      }
      const api = this._apps.api(this._name, this.#alias(params));
      const result = await api.readFile(filename);
      return this.#ok(result);
    } catch (e) {
      
      return this._utilities.io.response.error();
    }
  }
}

module.exports = HelloService;
