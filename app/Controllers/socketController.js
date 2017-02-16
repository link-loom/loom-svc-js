function Socket(dependencies) {

    /// Dependencies
    var _console;
    var _io;
    var _database;
    var _fileHandler;
    var _cross;
    var _uuid;

    const MAX_CLIENTS = 10;

    var _siteNamespaces = [];

    var constructor = function () {
        _io = dependencies.io;
        _database = dependencies.database;
        _console = dependencies.console;
        _fileHandler = dependencies.fileHandler;
        _cross = dependencies.cross;
        _uuid = dependencies.uuid;

        socketImplementation();
        _console.log('Socket module initialized', 'server-success');
    }

    var socketImplementation = function () {
        var some_namespace = _io.of('/some_namespace');

        /// User Pool Namespace (UPN)
        ///
        /// All site Users will be connected in this pool and wait for any request
        some_namespace.on('connection', function (socket) {
            _console.log('Client connected: ' + socket.id, 'socket-message');

            /// Emit a welcome message to new connection
            socket.emit('Welcome', { Message: 'Welcome to Main.Main', SocketId: socket.id });

            /// Catch when this connection is closed
            socket.on('disconnect', function () {
                _console.log('Client disconnected: ' + socket.id, 'socket-message');
            });
        });
    }

    return {
        Initialize: constructor
    }
}

module.exports = Socket;