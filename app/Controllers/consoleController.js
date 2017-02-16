function ConsoleController(dependencies) {

    /// Dependencies   
    var _colors;

    var constructor = function () {
        _colors = dependencies.colors;
    }

    var log = function (message, type) {
        switch (type) {
            case 'server-success':
                console.log(dependencies.colors.green(' Main: ') + message);
                break;
            case 'socket-message':
                console.log(dependencies.colors.gray(' Socket Message: ') + message);
                break;
            case 'error':
                console.log(dependencies.colors.red(' Error: ') + message);
                break;
            default:
                console.log(' ' + message);
        }
    }

    return {
        Initialize: constructor,
        log: log
    }
}

module.exports = ConsoleController;