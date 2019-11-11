/* global __fullStackTrace */
class ConsoleManager {
  constructor (dependencies) {
    this._dependencies = dependencies
    this._colors = dependencies.colors
    this._serverName = dependencies.config.SERVER_NAME
    this._stack = []
  }

  code (body) {
    console.log(this._colors.grey(' > ') + (this._dependencies.isJsonString(body) === true ? JSON.stringify(body) : body))
  }

  log (body) {
    console.log(this._dependencies.isJsonString(body) === true ? JSON.stringify(body) : body)
  }

  error (body, ignoreStack = false) {
    console.log(` ${this._colors.red('Error')}: ${(this._dependencies.isJsonString(body) === true ? JSON.stringify(body) : body)}`)

    if (!ignoreStack && (body && body.stack)) {
      const errorLine = body.stack.split('    at ')[1].split(':')[2]
      const stacktrace = __fullStackTrace
      const firstErrorIndex = stacktrace[0].indexOf('Line ') + 'Line '.length
      stacktrace[0] = `> --${stacktrace[0].replaceAt(firstErrorIndex, errorLine)}`

      console.log(` ${this._colors.red('Stacktrace')}: \n${stacktrace.join('\n --')}`)
    }
  }

  info (body, title) {
    console.log(` ${this._colors.cyan(`${title || this._serverName}:`)} ${(this._dependencies.isJsonString(body) === true ? JSON.stringify(body) : body)}`)
  }

  warning (body, title) {
    console.log(` ${this._colors.yellow(`${title || this._serverName}:`)} ${(this._dependencies.isJsonString(body) === true ? JSON.stringify(body) : body)}`)
  }

  success (body, title) {
    console.log(` ${this._colors.green(`${title || this._serverName}:`)} ${(this._dependencies.isJsonString(body) === true ? JSON.stringify(body) : body)}`)
  }
}

ConsoleManager.stack = {
  push: (data) => {
    this._stack.push(data)
  },
  flush: () => {
    this._stack = []
  },
  fetch: () => {
    return this._stack
  }
}

module.exports = { ConsoleManager }
