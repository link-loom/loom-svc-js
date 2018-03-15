function Console(dependencies) {

	/// Dependencies   
	const _colors = dependencies.colors;

	/// Properties
	var _stack = [];

	const constructor = () => {

	}

	const code = (body) => {
		console.log(_colors.grey(` > `) + (dependencies.isJsonString(body) == true ? JSON.stringify(body) : body));
	}

	const log = (body) => {
		console.log(dependencies.isJsonString(body) == true ? JSON.stringify(body) : body);
	}

	const error = (title, body) => {
		console.log(_colors.red(` ${title}: `) + (dependencies.isJsonString(body) == true ? JSON.stringify(body) : body));
	}

	const info = (title, body) => {
		console.log(_colors.cyan(` ${title}: `) + (dependencies.isJsonString(body) == true ? JSON.stringify(body) : body));
	}

	const warning = (title, body) => {
		console.log(_colors.yellow(` ${title}: `) + (dependencies.isJsonString(body) == true ? JSON.stringify(body) : body));
	}

	const success = (title, body) => {
		console.log(_colors.green(` ${title}: `) + (dependencies.isJsonString(body) == true ? JSON.stringify(body) : body));
	}

	const stack = {
		push: (data) => {
			_stack.push(data);
		},
		flush: () => {
			_stack = [];
		},
		fetch: () => {
			return _stack;
		}
	}

	return {
		Initialize: constructor,
		code: code,
		log: log,
		error: error,
		info: info,
		warning: warning,
		success: success,
		stack: stack
	}
}

module.exports = Console;