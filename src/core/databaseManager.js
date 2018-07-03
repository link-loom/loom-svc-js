function Database (dependencies) {
  const _firebaseManager = require(`${dependencies.root}/src/core/firebaseManager`)(dependencies)

  /// Dependencies
  const _firebase = dependencies.firebase
  const _console = dependencies.console
  const { lstatSync, readdirSync } = require('fs')
  const { join } = require('path')

  /// Properties
  let _db
  let _entities = {}

  const constructor = function () {
    _firebaseManager.setSettings()
    dependencies.settings.dependencies().add(_firebaseManager, 'firebaseManager')

    return databaseConnect()
  }

  const databaseConnect = function () {
    let result = false
    try {
      if (dependencies.config.USE_DATABASE) {
        switch (dependencies.config.DATABASE_NAME) {
          case 'firebase':
            firebaseConfig()
            break;
          default:
            break;
        }       
      }

      result = entitiesManager()
    } catch (error) {
      if (error) {
        if (error.code === 'app/invalid-credential') {
          _console.info(`Something was wrong with your Firebase credentials maybe you need add config/default.json file or check your credentials`)
        }

        _console.error(error.message)
        result = false
      }
    }
    
    return result
  }

  const firebaseConfig = function () {
    _firebase.initializeApp({
      credential: _firebase.credential.cert(_firebaseManager.getFirebaseCredentials()),
      databaseURL: _firebaseManager.getFirebaseURL()
    })
    _db = _firebase.database()
    dependencies.db = _db
  }

  const entitiesManager = function () {
    try {
      // Read all directories in controllers folder
      const isDirectory = source => lstatSync(source).isDirectory()
      const getDirectories = source =>
        readdirSync(source).map(name => join(source, name)).filter(isDirectory)

      const directories = getDirectories(`${dependencies.root}/src/controllers/`)

      // Map all controllers
      _entities['Initialize'] = constructor
      directories.map((path) => {
        if (path) {
          let name = path.split('\\')[path.split('\\').length - 1]
          _entities[name] = require(`${path}\\${name}Controller`)(dependencies)
        }
      })

      return true
    } catch (error) {
      _console.error(error)
      return false
    }
  }

  return {
    Initialize: constructor,
    entities: _entities
  }
}

module.exports = Database
