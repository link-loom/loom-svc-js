function Cross(dependencies) {
	var _firebaseCredentials = '';
	var _firebaseURL = '';

	const setSettings = () => {
		setFirebaseCredentials(dependencies.config.firebase);
		setFirebaseURL(dependencies.config.firebaseDatabase);
	}

	const getFirebaseCredentials = () => {
		return _firebaseCredentials;
	}

	const setFirebaseCredentials = (firebaseCredentials) => {
		_firebaseCredentials = firebaseCredentials;
	}

	const getFirebaseURL = () => {
		return _firebaseURL;
	}

	const setFirebaseURL = (firebaseURL) => {
		_firebaseURL = firebaseURL
	}

	/// Find an object dynamically by dot style
	/// E.g.
	/// var objExample = {employee: { firstname: "camilo", job:{name:"driver"}}}
	/// findObject(objExample, 'employee.job.name')
	const objectReferenceByDotStyle = (obj, is, value) => {
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
	const searchObjectByIdOnArray = (nameKey, _array) => {
		for (var i = 0; i < _array.length; i++) {
			if (_array[i].Id === nameKey) {
				return _array[i];
			}
		}
		return null;
	}

	const normalizePort = (val) => {
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

	const idGenerator = (length, prefix) => {
		// Convert it to base 36 (numbers + letters), and grab the first 9 characters
		// after the decimal.
		return (prefix == undefined ? 'video-' : prefix) + Math.random().toString(36).substr(2, (length == undefined ? 5 : length));
	}

	const throwError = function (message) {
		if (message) {
			return { success: false, message: message, result: null };
		}
		else {
			return { success: false, message: 'Something was wrong while you make this action', result: null };
		}
	}

	const throwSuccess = function (data, message) {
		if (message) {
			return {
				success: true,
				message: message,
				result: data
			}
		}
		else {
			return {
				success: true,
				message: 'Operation completed succesfuly',
				result: data
			}
		}
	}

	const propertyIsValid = function (property) {
		if (property) {
			if (property.success === true) {
				return true;
			}
			else {
				return false;
			}
		}
		else {
			return false;
		}
	}

	const sendBadRequest = function (req, res) {
		res.render('maintenanceView', null);
	}

	const castSnapshot = snapshot => {
		let returnArr = [];

		snapshot.forEach(childSnapshot => {
			let item = childSnapshot.val();
			returnArr.push(item);
		});

		return returnArr;
	}

	return {
		SetSettings: setSettings,
		GetFirebaseCredentials: getFirebaseCredentials,
		GetFirebaseURL: getFirebaseURL,
		ObjectReferenceByDotStyle: objectReferenceByDotStyle,
		SearchObjectByIdOnArray: searchObjectByIdOnArray,
		NormalizePort: normalizePort,
		IDGenerator: idGenerator,
		ThrowError: throwError,
		ThrowSuccess: throwSuccess,
		PropertyIsValid: propertyIsValid,
		SendBadRequest: sendBadRequest,
		CastSnapshot: castSnapshot,
	}
}

module.exports = Cross;