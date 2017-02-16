function SomeEntityController(dependencies) {

    /// Dependencies   
    var _mongoose;

    /// Properties
    var _entity;

    var constructor = function () {
        _mongoose = dependencies.mongoose;

        _entity = require('../Models/SomeEntity')(dependencies);
        _entity.Initialize();
    }

    var createSomeEntity = function (data, callback) {

        var someEntity = new _entity.GetModel()(
            {
                AttributeA: data.AttributeA,
                Nested: {
                    AttributeB: data.Nested.AttributeB,
                },
            });

        someEntity.save().then(function (result) {
            // When database return a result call the return
            callback();
        })
    }

    var deleteSomeEntity = function (data, callback) {
        _entity.GetModel().findOneAndRemove(data, function (err, result) {
            callback(result);
        })
    }

    var getSomeEntityById = function (data, callback) {
        _entity.GetModel().findOne({ "_id": data }, function (err, result) {
            if (err) console.log(err);

            callback(result);
        })
    }

    var getAllSomeEntity = function (data, callback) {
        _entity.GetModel().find({}, function (err, result) {
            if (err) console.log(err);

            callback(result);
        })
    }

    var getEntity = function () {
        return _entity;
    }

    return {
        Initialize: constructor,
        CreateSomeEntity: createSomeEntity,
        DeleteSomeEntity: deleteSomeEntity,
        GetSomeEntityById: getSomeEntityById,
        GetAllSomeEntity: getAllSomeEntity,
        Entity: getEntity
    }
}

module.exports = SomeEntityController;