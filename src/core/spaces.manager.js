class SpacesManager {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies
    this._console = dependencies.console

    /* Custom Properties */

    /* Assigments */
    this._namespace = '[Server]::[Spaces]::[Manager]'
    this._credentials = ''
  }

  setup (credentials) {
    this._console.success('Loading', { namespace: this._namespace })

    this.setCredentials(credentials)

    this._console.success('Loaded', { namespace: this._namespace })
  }

  getCredentials () {
    return this._credentials
  }

  setCredentials (credentials) {
    this._credentials = credentials
  }
}

module.exports = { SpacesManager }
