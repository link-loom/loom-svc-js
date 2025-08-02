class ApiManagerService {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies;
    this._database = this._dependencies?.database?.default?.adapter;
    this._models = dependencies.models;
    this._utilities = dependencies.utilities;
    this._console = this._dependencies.console;
    this._firebase = dependencies.firebaseManager;
    this._services = this._dependencies.services;

    /* Custom Properties */
    this._config = this._dependencies.config;

    /* Assigments */
    this._key = this._utilities.generator.privateKey(
      dependencies?.config?.services?.apiManager?.secret,
    );
  }

  async getApiManagerUri ({ params }) {
    return this._utilities.io.response.success({
      uri: this._config?.services?.apiManager?.uri || '/',
    });
  }

  get key () {
    return this._key;
  }
}

module.exports = ApiManagerService;
