function Database (dependencies) {
  /// Dependencies
  /* const _firebase = dependencies.firebase
  const _utilities = dependencies.utilities
  const _console = dependencies.console */

  /// Properties
  /* var _db
  var _firebaseApp */

  /// Entities
  /* var _video
  var _categories */

  const constructor = function () {
    return databaseConnect()
  }

  const databaseConnect = function () {
    /* _firebaseApp = _firebase.initializeApp({
      credential: _firebase.credential.cert(_cross.GetFirebaseCredentials()),
      databaseURL: _cross.GetFirebaseURL()
    });
    _db = _firebase.database();
    dependencies.db = _db; */

    dependencies.db = {}

    return databaseHandler()
  }

  const databaseHandler = function () {
    return entitiesControllers()
  }

  const entitiesControllers = function () {
    /// Some pretty controllers
    /* _video = require('./VideoController')(dependencies);
    _categories = require('./CategoryController')(dependencies); */

    return true // <--- CHANGE IT TO CONTROL THE VALUE
  }

  /* const getVideo = function(){
    return _video
  }

  const getCategories = function(){
    return _categories;
  } */

  return {
    Initialize: constructor
    /* Video: getVideo,
    Category: getCategories, */
  }
}

module.exports = Database
