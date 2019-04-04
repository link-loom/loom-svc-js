function functionsManager (dependencies) {
  const _bucket = require(`${dependencies.root}/src/functions/bucket`)

  /// Dependencies
  const _console = dependencies.console
  const _moment = dependencies.moment

  // Properties
  let _functions = {
    cached: {},
    timed: {}
  }

  const constructor = () => {
    createCached()
    createTimed()

    _console.success('Functions module initialized')
  }

  const createCached = () => {
    // build each api routes
    _bucket.cached.map((component) => {
      try {
        _console.success(`Initializing ${component.name} function`)

        /* Setup config */
        const _functionName = component.route.split('/')[component.route.split('/').length - 1]
        const name = _functionName.split('.')[0]
        const pathname = `${dependencies.root}/src${component.route}`

        /* Setup namespace */
        _functions.cached[name] = require(pathname)(dependencies)
      } catch (error) {
        _console.error(`Component failed: ${JSON.stringify(component)}`, true)
        _console.error(error)
      }
    })
  }

  const createTimed = () => {
    // build each api routes
    _bucket.timed.map((component) => {
      try {
        const _function = require(`${dependencies.root}/src${component.route}`)(dependencies)
        const seconds = _moment(`${component.startAt}`, `hh:mm:ss`).diff(_moment(), 'milliseconds') > 0
          /* Add the next ticket if has time remaining */
          ? _moment(`${component.startAt}`, `hh:mm:ss`)
            .diff(_moment(), 'milliseconds')
          /* Add necesary time to next ticket */
          : _moment(`${component.startAt}`, `HH:mm:ss`)
            .add(_moment.duration(+`${component.intervalTime}`, `${component.intervalMeasure}`), `${component.intervalMeasure}`)
            .diff(_moment(), 'milliseconds')

        _console.success(`Initializing ${component.name} function`)

        /* Including in dependencies */
        _functions.timed[component.name] = _function

        if (seconds > 0) {
          setTimeout(() => {
            /* Execute at first tick */
            _function[component.name]()

            /* Setup next ticks */
            setInterval(
              _function[component.name],
              _moment.duration(+`${component.intervalTime}`, `${component.intervalMeasure}`).as('milliseconds')
            )
          }, seconds)
        }
      } catch (error) {
        _console.error(`Component failed: ${JSON.stringify(component)}`, true)
        _console.error(error)
      }
    })
  }

  constructor()

  return _functions
}

module.exports = functionsManager
