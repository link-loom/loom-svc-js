function Database (dependencies) {
  const _firebaseManager = require(`${dependencies.root}/src/core/firebase.manager`)(dependencies)
  const _postgresqlManager = require(`${dependencies.root}/src/core/postgresql.manager`)(dependencies)

  /// Dependencies
  const _firebase = dependencies.firebase
  const _console = dependencies.console
  const _pg = dependencies.pg

  /// Properties
  let _db
  let _storage = {}

  const constructor = () => {
    return databaseConnect()
  }

  const databaseConnect = async () => {
    if (dependencies.config.USE_DATABASE) {
      switch (dependencies.config.DATABASE_NAME) {
        case 'firebase':
          _firebaseManager.setSettings()
          dependencies.settings.dependencies().add(_firebaseManager, 'firebaseManager')
          await firebaseConfig()
          break
        case 'postgresql':
          _postgresqlManager.setSettings(dependencies.config.POSTGRESQL)
          dependencies.settings.dependencies().add(_postgresqlManager, 'postgresqlManager')
          await postgresqlConfig()
          break
        default:
          break
      }
    } else {
      _console.info('Database is not configured')
    }

    dependencies.db = _db || {}
    dependencies.storage = _storage || {}
  }

  const postgresqlConfig = async () => {
    const pool = new _pg.Pool(_postgresqlManager.getCredentials())
    _db = pool
  }

  const firebaseConfig = async () => {
    _firebase.initializeApp({
      credential: _firebase.credential.cert(_firebaseManager.getFirebaseAdminCredentials()),
      databaseURL: _firebaseManager.getFirebaseURL(),
      storageBucket: _firebaseManager.getStorageBucketURL()
    })
    const settings = { timestampsInSnapshots: true }
    _db = _firebase.firestore()
    _db.settings(settings)
    _storage = _firebase.storage()
  }

  return {
    initialize: constructor
  }
}

module.exports = Database