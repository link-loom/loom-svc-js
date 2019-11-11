class SettingsManager {
  constructor (args) {
    this._args = args

    this.loadSettings()
  }

  loadSettings () {
    this.globalDependencies()
    this.languageExtensions()
    this.setupMiddlewares()
  }

  globalDependencies () {
    const { DependenciesManager } = require('./dependencies.manager')
    const { UtilitiesManager } = require('./utilities.manager')
    this._dependencies = new DependenciesManager(this._args)
    this._utilities = new UtilitiesManager(this._dependencies.core.get())

    this._dependencies.core.add(this._utilities, 'utilities')
    this._dependencies.core.add((str) => {
      try {
        JSON.parse(str)
      } catch (e) {
        return false
      }
      return true
    }, 'isJsonString')
  }

  languageExtensions () {
    /* eslint-disable */
    Object.defineProperty(global, '__stack', {
      get: function () {
        const orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function (_, stack) {
          return stack;
        };
        const err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        const stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
      }
    })

    Object.defineProperty(global, '__fullStackTrace', {
      get: function () {
        let stackTrace = __stack.map((trace) => {
          return `[${trace.getFileName()}][Line ${trace.getLineNumber()}]: ${trace.getFunctionName()}()`
        })
        return stackTrace.slice(2, stackTrace.length - 1)
      }
    })

    String.prototype.regexIndexOf = function (regex, startpos) {
      var indexOf = this.substring(startpos || 0).search(regex);
      return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
    }

    String.prototype.regexLastIndexOf = function (regex, startpos) {
      regex = (regex.global) ? regex : new RegExp(regex.source, "g" + (regex.ignoreCase ? "i" : "") + (regex.multiLine ? "m" : ""));
      if (typeof (startpos) == "undefined") {
        startpos = this.length;
      } else if (startpos < 0) {
        startpos = 0;
      }
      var stringToWorkWith = this.substring(0, startpos + 1);
      var lastIndexOf = -1;
      var nextStop = 0;
      while ((result = regex.exec(stringToWorkWith)) != null) {
        lastIndexOf = result.index;
        regex.lastIndex = ++nextStop;
      }
      return lastIndexOf;
    }

    String.prototype.replaceAt = function (index, replacement) {
      return this.substr(0, index) + replacement + this.substr(index + replacement.length);
    }

    String.prototype.replaceAll = function (search, replacement) {
      var target = this
      return target.replace(new RegExp(search, 'g'), replacement)
    }

    /* eslint no-extend-native: ["error", { "exceptions": ["String"] }] */
    String.prototype.capitalize = function () {
      return this.replace(/\b\w/g, l => l.toUpperCase())
    }
    /* eslint-enable */

    this.findPolyfill()
    this.findIndexPolyfill()

    console.log(` ${this._dependencies.core.get().colors.green(`${this._dependencies.core.get().config.SERVER_NAME}:`)} Language extended`)
  }

  findPolyfill () {
    /* eslint no-extend-native: ["error", { "exceptions": ["Array"] }] */
    if (!Array.prototype.find) {
      Object.defineProperty(Array.prototype, 'find', {
        value: function (predicate) {
          // 1. Let O be ? ToObject(this value).
          if (this == null) {
            throw new TypeError('"this" is null or not defined')
          }

          const obj = Object(this)

          // 2. Let len be ? ToLength(? Get(O, "length")).
          const len = obj.length >>> 0

          // 3. If IsCallable(predicate) is false, throw a TypeError exception.
          if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function')
          }

          // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
          const args = arguments[1]

          // 5. Let k be 0.
          let index = 0

          // 6. Repeat, while k < len
          while (index < len) {
            // a. Let Pk be ! ToString(k).
            // b. Let kValue be ? Get(O, Pk).
            // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
            // d. If testResult is true, return kValue.
            const indexValue = obj[index]
            if (predicate.call(args, indexValue, index, obj)) {
              return indexValue
            }
            // e. Increase k by 1.
            index++
          }

          // 7. Return undefined.
          return undefined
        }
      })
    }
  }

  findIndexPolyfill () {
    /* eslint no-extend-native: ["error", { "exceptions": ["Array"] }] */
    if (!Array.prototype.findIndex) {
      Array.prototype.findIndex = function (fn) {
        if (this === null) {
          throw new TypeError('Array.prototype.findIndex called on null or undefined')
        }
        if (typeof fn !== 'function') {
          throw new TypeError('predicate must be a function')
        }

        const list = Object(this)
        const length = list.length >>> 0
        const args = arguments[1]
        let value = {}

        for (let i = 0; i < length; i++) {
          value = list[i]
          if (fn.call(args, value, i, list)) {
            return i
          }
        }
        return -1
      }
    }
  }

  setupMiddlewares () {
    // Security
    this._dependencies.core.get().express.use(this._dependencies.core.get().helmet())
    this._dependencies.core.get().express.disable('x-powered-by')
    this._dependencies.core.get().express.use(this._dependencies.core.get().compress())

    // use body parser so we can get info from POST and/or URL parameters
    this._dependencies.core.get().express.use(this._dependencies.core.get().bodyParser.urlencoded({ extended: true })) // support encoded bodies
    this._dependencies.core.get().express.use(this._dependencies.core.get().bodyParser.json()) // support json encoded bodies
    this._dependencies.core.get().express.use(this._dependencies.core.get().cors())
    this._dependencies.core.get().express.use(this._dependencies.core.get().cookieParser())

    console.log(` ${this._dependencies.core.get().colors.green(`${this._dependencies.core.get().config.SERVER_NAME}:`)} Configured middlewares`)
  }

  get dependencies () {
    return this._dependencies
  }
}

module.exports = { SettingsManager }
