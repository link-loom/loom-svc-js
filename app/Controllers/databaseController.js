function Database(dependencies) {

    /// Dependencies   
    var _mongoose;
    var _cross;

    /// Properties
    var _db;
    var _dbConnected;

    /// Entities
    var _someEntity;

    var constructor = function (callback) {
        _mongoose = dependencies.mongoose;
        _cross = dependencies.cross;
        _console = dependencies.console;
        _grid = dependencies.grid;
        _gridfs = dependencies.gridfs;

        databaseConnect(function (result) {
            callback(result);
        });
    }

    var databaseConnect = function (callback) {
        _mongoose.Promise = global.Promise;
        _mongoose.connect(_cross.GetMongoConnectionString());
        _db = _mongoose.connection;

        databaseHandler(function (result) {
            if (result == true) {
                _console.log('Database module initialized', 'server-success');
            }
            callback(result);
        });
    }

    var databaseHandler = function (callback) {
        _db.on('error', function (err) {
            _console.log('database failed to initialize' + err, 'error')
            _dbConnected = false;
            callback(false);
        });

        _db.once('open', function () {
            _console.log('Database connected at ' + _cross.GetMongoConnectionString(), 'server-success');
            _dbConnected = true;

            _gridfs = _grid(_db.db, _mongoose.mongo);

            entitiesControllers(function (result) {
                createIndexes();

                callback(result);
            });

        });
    }

    /// To improve performance
    var createIndexes = function(){
        /*_mongoose.connection.db.collection('Collection_Name').createIndex({"ApiKey": 1});
        _mongoose.connection.db.collection('Collection_Name').createIndex({"Pathname": 1});*/
    }

    var getGridFS = function () {
        return _gridfs;
    }

    var entitiesControllers = function (callback) {
        _someEntity = require('./SomeEntityController')(dependencies);
        _someEntity.Initialize();

        callback(true);
    }

    var isConnected = function () {
        return _dbConnected;
    }

    var getSomeEntityController = function () {
        return _someEntity;
    }


    return {
        Initialize: constructor,
        IsConnected: isConnected,
        SomeEntity: getSomeEntityController,
        
    }
}

module.exports = Database;