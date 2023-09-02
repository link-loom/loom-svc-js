class Function {
  constructor(dependencies) {
    /* Base Properties */
    this._dependencies = dependencies;
    this._utilities = this._dependencies.utilities;
    this._console = this._dependencies.console;

    /* Custom Properties */
    /* this._myPrivateProperty = 'Some value' */

    /* Assigments */
    this._namespace = '[Function]::[Startup]::[_Template]';
  }

  async run() {
    this._console.info('Executing Function', { namespace: this._namespace });
  }
}

module.exports = Function;
