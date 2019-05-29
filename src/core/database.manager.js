function Database (dependencies) {
  const _firebaseManager = require(`${dependencies.root}/src/core/firebase.manager`)(dependencies)

  /// Dependencies
  const _firebase = dependencies.firebase
  const _console = dependencies.console

  /// Properties
  let _db

  const constructor = () => {
    _firebaseManager.setSettings()
    dependencies.settings.dependencies().add(_firebaseManager, 'firebaseManager')

    return databaseConnect()
  }

  const databaseConnect = () => {
    let result = false
    try {
      if (dependencies.config.USE_DATABASE) {
        switch (dependencies.config.DATABASE_NAME) {
          case 'firebase':
            result = firebaseConfig()
            break
          default:
            break
        }
      } else {
        _console.info(`Database is not configured`)
        result = true
      }
    } catch (error) {
      if (error) {
        if (error.code === 'app/invalid-credential') {
          _console.info(`Something was wrong with your Firebase credentials maybe you need add config/default.json file or check your credentials`)
        }

        _console.error(error.message)
        result = false
      }
    }

    dependencies.db = _db || {}

    return result
  }

  const firebaseConfig = () => {
    try {
      _firebase.initializeApp({
        credential: _firebase.credential.cert(_firebaseManager.getFirebaseCredentials()),
        databaseURL: _firebaseManager.getFirebaseURL()
      })
      _db = _firebase.database()

      return true
    } catch (error) {
      _console.error(error)
      return false
    }
  }

  return {
    initialize: constructor
  }
}

module.exports = Database
