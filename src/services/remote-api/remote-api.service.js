class RemoteApiService {
  constructor(dependencies) {
    /* Base Properties */
    this._dependencies = dependencies;
    this._db = dependencies.db;
    this._models = dependencies.models;
    this._utilities = dependencies.utilities;
    this._console = this._dependencies.console;
    this._services = this._dependencies.services;

    /* Custom Properties */
    this._request = this._dependencies.request;

    /* Assigments */
    /* this._newPrivateObject = new SomeObject(this._dependencies) */
  }

  async request(data) {
    if (
      !data ||
      !data.url ||
      typeof data.url !== 'string' ||
      data.url.length <= 0
    ) {
      return null;
    }

    try {
      return await this.#executeRequest(data);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  #executeRequest({ url, method, body, headers }) {
    return this._request({
      url,
      method,
      data: body || {},
      headers,
    });
  }
}

module.exports = RemoteApiService;
