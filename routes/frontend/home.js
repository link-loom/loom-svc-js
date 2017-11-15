function home(dependencies) {

	const _database = dependencies.database;
	const _cross = dependencies.cross;

	const index = function (req, res) {
		var someCondition = true;
		if (someCondition === true) {
			res.render('indexView', { title: 'Home', data: null});
		}
		else {
			_cross.SendBadRequest(req, res, categoriesResult.result);
		}

	}

	return {
		index: index
	}
}

module.exports = home;