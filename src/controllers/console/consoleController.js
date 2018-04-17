function Console (dependencies) {
  /// Dependencies
  const _colors = dependencies.colors
  const _serverName = dependencies.config.SERVER_NAME

  /// Properties
  var _stack = []

  const constructor = () => {

  }

  const code = (body) => {
    console.log(_colors.grey(` > `) + (dependencies.isJsonString(body) === true ? JSON.stringify(body) : body))
  }

  const log = (body) => {
    console.log(dependencies.isJsonString(body) === true ? JSON.stringify(body) : body)
  }

  const error = (body, title) => {
    console.log(` ${_colors.red()}: ${(dependencies.isJsonString(body) === true ? JSON.stringify(body) : body)}`)
  }

  const info = (body, title) => {
    console.log(` ${_colors.cyan(`${title || _serverName}:`)}: ${(dependencies.isJsonString(body) === true ? JSON.stringify(body) : body)}`)
  }

  const warning = (body, title) => {
    console.log(` ${_colors.yellow(`${title || _serverName}:`)}: ${(dependencies.isJsonString(body) === true ? JSON.stringify(body) : body)}`)
  }

  const success = (body, title) => {
    console.log(` ${_colors.green(`${title || _serverName}:`)} ${(dependencies.isJsonString(body) === true ? JSON.stringify(body) : body)}`)
  }

  const stack = {
    push: (data) => {
      _stack.push(data)
    },
    flush: () => {
      _stack = []
    },
    fetch: () => {
      return _stack
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

module.exports = Console
