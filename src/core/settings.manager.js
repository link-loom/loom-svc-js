function settings (args) {
  const dependenciesManager = require('./dependencies.manager')(args)

  const setup = () => {
    globalDependencies()
    languageExtensions()
    setupMiddlewares()
  }

  const globalDependencies = () => {
    const utilities = require('./utilities.manager')(dependenciesManager.get())
    dependenciesManager.add(utilities, 'utilities')

    dependenciesManager.add((str) => {
      try {
        JSON.parse(str)
      } catch (e) {
        return false
      }
      return true
    }, 'isJsonString')
  }

  const languageExtensions = () => {
    /* eslint-disable */
    Object.defineProperty(global, '__stack', {
      get: function () {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function (_, stack) {
          return stack;
        };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
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

    findPolyfill()
    findIndexPolyfill()

    console.log(` ${dependenciesManager.get().colors.green(`${dependenciesManager.get().config.SERVER_NAME}:`)} Language extended`)
  }

  const findPolyfill = () => {
    /* eslint no-extend-native: ["error", { "exceptions": ["Array"] }] */
    if (!Array.prototype.find) {
      Object.defineProperty(Array.prototype, 'find', {
        value: function (predicate) {
          // 1. Let O be ? ToObject(this value).
          if (this == null) {
            throw new TypeError('"this" is null or not defined')
          }

          var o = Object(this)

          // 2. Let len be ? ToLength(? Get(O, "length")).
          var len = o.length >>> 0

          // 3. If IsCallable(predicate) is false, throw a TypeError exception.
          if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function')
          }

          // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
          var thisArg = arguments[1]

          // 5. Let k be 0.
          var k = 0

          // 6. Repeat, while k < len
          while (k < len) {
            // a. Let Pk be ! ToString(k).
            // b. Let kValue be ? Get(O, Pk).
            // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
            // d. If testResult is true, return kValue.
            var kValue = o[k]
            if (predicate.call(thisArg, kValue, k, o)) {
              return kValue
            }
            // e. Increase k by 1.
            k++
          }

          // 7. Return undefined.
          return undefined
        }
      })
    }
  }

  const findIndexPolyfill = () => {
    /* eslint no-extend-native: ["error", { "exceptions": ["Array"] }] */
    if (!Array.prototype.findIndex) {
      Array.prototype.findIndex = function (predicate) {
        if (this === null) {
          throw new TypeError('Array.prototype.findIndex called on null or undefined')
        }
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function')
        }
        var list = Object(this)
        var length = list.length >>> 0
        var thisArg = arguments[1]
        var value

        for (var i = 0; i < length; i++) {
          value = list[i]
          if (predicate.call(thisArg, value, i, list)) {
            return i
          }
        }
        return -1
      }
    }
  }

  const setupMiddlewares = () => {
    // Security
    dependenciesManager.get().express.use(dependenciesManager.get().helmet())
    dependenciesManager.get().express.disable('x-powered-by')
    dependenciesManager.get().express.use(dependenciesManager.get().compress())

    // use body parser so we can get info from POST and/or URL parameters
    dependenciesManager.get().express.use(dependenciesManager.get().bodyParser.urlencoded({ extended: true })) // support encoded bodies
    dependenciesManager.get().express.use(dependenciesManager.get().bodyParser.json()) // support json encoded bodies
    dependenciesManager.get().express.use(dependenciesManager.get().cors())
    dependenciesManager.get().express.use(dependenciesManager.get().cookieParser())

    console.log(` ${dependenciesManager.get().colors.green(`${dependenciesManager.get().config.SERVER_NAME}:`)} Configured middlewares`)
  }

  const getDependenciesManager = () => {
    return dependenciesManager
  }

  return {
    initialize: setup,
    dependencies: getDependenciesManager
  }
}

module.exports = settings
