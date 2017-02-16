function SomeEntity(dependencies) {

    /// Dependencies
    var _mongoose;
    var _schema;

    /// Properties
    var _model;

    var constructor = function () {
        _mongoose = dependencies.mongoose;
        _schema = _mongoose.Schema;

        _model = _mongoose.model('SomeEntity', new _schema(
            {
                AttributeA: String,
                Nested: {
                    AttributeB: { X: Number, Y: Number },
                },
            },
            { timestamps: { createdAt: 'created_at' }, minimize: false, collection: 'SomeEntity' }
        ));
    }

    var getModel = function () {
        return _model;
    }

    return {
        Initialize: constructor,
        GetModel: getModel
    }
}

module.exports = SomeEntity;