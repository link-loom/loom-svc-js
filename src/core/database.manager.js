class DatabaseManager {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies
    this._console = dependencies.console

    /* Custom Properties */
    this._firebase = dependencies.firebase
    this._pg = dependencies.pg
    this._firebaseManager = {}
    this._postgresqlManager = {}
    this._db = {}

    /* Assigments */
    this._namespace = '[Server]::[Database]::[Manager]'    
  }

  setup () {
    this._console.success('Loading', { namespace: this._namespace })

    const { FirebaseManager } = require(`${this._dependencies.root}/src/core/firebase.manager`)
    const { PostgresqlManager } = require(`${this._dependencies.root}/src/core/postgresql.manager`)

    this._firebaseManager = new FirebaseManager(this._dependencies)
    this._postgresqlManager = new PostgresqlManager(this._dependencies)

    this.loadDatabase()

    this._console.success('Loaded', { namespace: this._namespace })
  }

  async loadDatabase () {
    if (!this._dependencies.config.SETTINGS.USE_DATABASE) {
      this._console.info('Database is disabled', { namespace: this._namespace })
      return
    }

    switch (this._dependencies.config.SETTINGS.DATABASE_NAME) {
      case 'firebase':
        this._firebaseManager.setup()
        this._dependencies.settings.dependencies.core.add(this._firebaseManager, 'firebaseManager')
        await this.firebaseConfig()
        break
      case 'postgresql':
        this._postgresqlManager.setup()
        this._dependencies.settings.dependencies.core.add(this._postgresqlManager, 'postgresqlManager')
        await this.postgresqlConfig()
        break
      default:
        break
    }

    this._dependencies.db = this._db || {}
    this._console.success('Database manager loaded')
  }

  async postgresqlConfig () {
    const pool = new this._pg.Pool(this._postgresqlManager.getCredentials())
    this._db = pool
  }

  async firebaseConfig () {
    this._firebase.initializeApp({
      credential: this._firebase.credential.cert(this._firebaseManager.getFirebaseAdminCredentials()),
      databaseURL: this._firebaseManager.getFirebaseURL()
    })

    const settings = { timestampsInSnapshots: true }
    this._db = this._firebase.firestore()
    this._db.settings(settings)
  }
}

module.exports = { DatabaseManager }
