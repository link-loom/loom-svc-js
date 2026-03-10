// src/routes/api/hello.route.js
class HelloRoute {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies;
    this._utilities = this._dependencies.utilities;
    this._console = this._dependencies.console;
    this._services = this._dependencies.services;

    /* Custom Properties */
    /* this._myPrivateProperty = 'Some value' */

    /* Assigments */
    /* this._newPrivateObject = new SomeObject(this._dependencies) */
    this.EntityService = this._services.HelloService;
  }

  // query/body llegan como params desde ApiModule -> #handleRoute
  async ping (ctx) {
    const entityService = new this.EntityService(this._dependencies);
    return entityService.ping(ctx);
  }
  async status (ctx) {
    const entityService = new this.EntityService(this._dependencies);
    return entityService.status(ctx);
  }
  async echo (ctx) {
    const entityService = new this.EntityService(this._dependencies);
    return entityService.echo(ctx);
  }
  async write (ctx) {
    const entityService = new this.EntityService(this._dependencies);
    return entityService.write(ctx);
  }
  async read (ctx) {
    const entityService = new this.EntityService(this._dependencies);
    return entityService.read(ctx);
  }
}

module.exports = HelloRoute;
