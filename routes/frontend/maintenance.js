function maintenance(dependencies) {

	const _database = dependencies.database;
	const _server = dependencies.server;

	const index = function (req, res) {
		_server.response.badRequestView(req, res, []);
	}

	return {
		index: index
	}
}

module.exports = maintenance;
