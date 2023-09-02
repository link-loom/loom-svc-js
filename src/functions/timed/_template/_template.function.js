class Function {
  constructor(dependencies) {
    /* Base Properties */
    this._dependencies = dependencies;
    this._utilities = this._dependencies.utilities;
    this._console = this._dependencies.console;

    /* Custom Properties */
    /* this._myPrivateProperty = 'Some value' */
    this._services = this._dependencies.services;

    /* Assigments */
    /* this._newPrivateObject = new SomeObject(this._dependencies) */
    this._namespace = '[Function]::[Timed]::[_Template]';
  }

  run() {
    this.getStatus();
  }

  async getStatus() {
    try {
      this._console.info('Executing timed function');

      const statusService = new this._services.HealthService(
        this._dependencies,
      );
      const statusResponse = await statusService.get();

      if (this._utilities.validator.response(statusResponse)) {
        this._console.log(statusResponse, { namespace: this._namespace });
      }
    } catch (error) {
      this._console.error(error);
    }
  }
}

module.exports = Function;
