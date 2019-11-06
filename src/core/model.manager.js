function dependencies (dependencies) {
  const _console = dependencies.console

  let _models

  const setup = () => {
    _models = {}

    instantiateDependencies()
  }

  const instantiateDependencies = () => {
    _models = require(`${dependencies.root}/src/models/index`)

    _console.success('Models imported')
  }

  const getModels = () => {
    return _models
  }

  setup()
  return {
    get: getModels
  }
}

module.exports = dependencies
