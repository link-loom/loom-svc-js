function Database(dependencies) {
	
		/// Dependencies   
		const _firebase = dependencies.firebase;
		const _cross = dependencies.cross;
		const _console = dependencies.console;
	
		/// Properties
		var _db;
		var _firebaseApp;
	
		/// Entities
		var _video;
		var _categories;
	
		const constructor = function (next) {
			databaseConnect(function (result) {
				next(result);
			});
		}

		const databaseConnect = function (next) {
			/* _firebaseApp = _firebase.initializeApp({ 
				credential: _firebase.credential.cert(_cross.GetFirebaseCredentials()),
				databaseURL: _cross.GetFirebaseURL()
			 });
			_db = _firebase.database();
			dependencies.db = _db; */

			dependencies.db = {};
	
			databaseHandler(function(result){
				next(result)
			});
		}
	
		const databaseHandler = function (next) {
			entitiesControllers(function (result) {
				next(result);
			});
		}
	
		const entitiesControllers = function (next) {
			/// Some pretty controllers
			/* _video = require('./VideoController')(dependencies);
			_categories = require('./CategoryController')(dependencies); */
	
			next(true); // <--- CHANGE IT TO CONTROL THE VALUE
		}
	
		/* const getVideo = function(){
			return _video
		}
	
		const getCategories = function(){
			return _categories;
		} */
	
		return {
			Initialize: constructor,
			/* Video: getVideo,
			Category: getCategories, */
		}
	}
	
	module.exports = Database;