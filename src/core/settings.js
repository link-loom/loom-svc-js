function settings (args) {
  const dependenciesManager = require('./dependencies')(args)

  const setup = () => {
    globalDependencies()
    languageExtensions()
    setupMiddlewares()
  }

  const globalDependencies = () => {
    const utilities = require('./utilities')(dependenciesManager.get())
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
    dependenciesManager.get().httpServer.use(dependenciesManager.get().helmet())
    dependenciesManager.get().httpServer.disable('x-powered-by')
    dependenciesManager.get().httpServer.use(dependenciesManager.get().compress())

    // use body parser so we can get info from POST and/or URL parameters
    dependenciesManager.get().httpServer.use(dependenciesManager.get().bodyParser.urlencoded({ extended: true })) // support encoded bodies
    dependenciesManager.get().httpServer.use(dependenciesManager.get().bodyParser.json()) // support json encoded bodies
    dependenciesManager.get().httpServer.use(dependenciesManager.get().cors())
    dependenciesManager.get().httpServer.use(dependenciesManager.get().cookieParser())

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
