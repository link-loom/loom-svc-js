class PostgresqlManager {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies
    this._console = dependencies.console

    /* Custom Properties */

    /* Assigments */
    this._namespace = '[Server]::[PostgreSQL]::[Manager]'
    this._credentials = ''
  }

  setup () {
    this._console.success('Loading', { namespace: this._namespace })

    this.setCredentials(this._dependencies.config.POSTGRESQL)

    this._console.success('Loaded', { namespace: this._namespace })
  }

  getCredentials () {
    return this._credentials
  }

  setCredentials (credentials) {
    this._credentials = credentials
  }
}

module.exports = { PostgresqlManager }
