function Cross(dependencies) {
    var _mongoConnectionString;
    var _mainSecretJWT;
    var _mailgunApiKey = '';
    var _mailgunDomain = '';
    var _stripePK = '';

    var setSettings = function(){
        setMainSecretJWT(dependencies.config.MainSecretJWT);
        setMongoConnectionString(dependencies.config.MongoConnectionString);
        setMailgunApiKey(dependencies.config.MailgunApiKey);
        setMailgunDomain(dependencies.config.MailgunDomain);
        setStripePrivateKey(dependencies.config.StripePrivateKey);
    }

    var getMongoConnectionString = function () {
        return _mongoConnectionString;
    }

    var setMongoConnectionString = function (connectionString) {
        _mongoConnectionString = connectionString;
    }

    var getMainSecretJWT = function () {
        return _mainSecretJWT;
    }

    var setMainSecretJWT = function (secret) {
        _mainSecretJWT = secret;
    }

    /// Find an object dynamically by dot style
    /// E.g.
    /// var objExample = {employee: { firstname: "camilo", job:{name:"driver"}}}
    /// findObject(objExample, 'employee.job.name')
    var objectReferenceByDotStyle = function (obj, is, value) {
        if (typeof is == 'string')
            return index(obj, is.split('.'), value);
        else if (is.length == 1 && value !== undefined)
            return obj[is[0]] = value;
        else if (is.length == 0)
            return obj;
        else
            return index(obj[is[0]], is.slice(1), value);
    }

    /// Find an object into array by Id
    /// E.g.
    /// var objectResult = searchObjectByIdOnArray("someId", myArray)
    var searchObjectByIdOnArray = function (nameKey, _array) {
        for (var i = 0; i < _array.length; i++) {
            if (_array[i].Id === nameKey) {
                return _array[i];
            }
        }
        return null;
    }

    var normalizePort = function (val) {
        var port = parseInt(val, 10);

        if (isNaN(port)) {
            // named pipe
            return val;
        }

        if (port >= 0) {
            // port number
            return port;
        }

        return false;
    }

    var setMailgunApiKey = function (apiKey) {
        _mailgunApiKey = apiKey;
    }

    var getMailgunApiKey = function () {
        return _mailgunApiKey;
    }

    var setMailgunDomain = function (domain) {
        _mailgunDomain = domain;
    }

    var getMailgunDomain = function () {
        return _mailgunDomain;
    }

    var setStripePrivateKey = function(privateKey){
        _stripePK = privateKey;
    }

    var getStripePrivateKey = function(){
        return _stripePK;
    }

    return {
        SetSettings: setSettings,
        GetMongoConnectionString: getMongoConnectionString,
        GetMainSecretJWT: getMainSecretJWT,
        ObjectReferenceByDotStyle: objectReferenceByDotStyle,
        SearchObjectByIdOnArray: searchObjectByIdOnArray,
        NormalizePort: normalizePort,
        GetMailgunApiKey: getMailgunApiKey,
        GetMailgunDomain: getMailgunDomain,
        GetStripePrivateKey: getStripePrivateKey,
    }
}

module.exports = Cross;