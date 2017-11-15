function maintenance(dependencies) {

	const _database = dependencies.database;
	const _cross = dependencies.cross;

	const index = function (req, res) {
		_cross.SendBadRequest(req, res, []);

	}

	return {
		index: index
	}
}

module.exports = maintenance;