function ControllerManager (dependencies) {
  /// Dependencies
  const _console = dependencies.console
  const { lstatSync, readdirSync } = require('fs')
  const { join } = require('path')

  /// Properties
  let _controllers = {}

  try {
    // Read all directories in controllers folder
    // Read all directories in controllers folder
    const isDirectory = (source) => {
      return lstatSync(source).isDirectory()
    }
    const getDirectories = (source) => {
      let result = readdirSync(source)
        .map((name) => {
          return join(source, name)
        })
        .filter(isDirectory)
      return result
    }

    const directories = getDirectories(`${dependencies.root}/src/controllers/`)

    // Map all controllers
    directories.map((path) => {
      try {
        if (path) {
          let name = path.includes('/')
            ? path.split('/')[path.split('/').length - 1]
            : path.split('\\')[path.split('\\').length - 1]

          let pathName = path.includes('/')
            ? `${path}/${name}.ontroller`
            : `${path}\\${name}.controller`
          // self and dynamic propagation
          dependencies.controllers = _controllers
          _controllers[name] = require(pathName)(dependencies)
        }
      } catch (error) {
        _console.error(error)
      }
    })
  } catch (error) {
    _console.error(error)
  }

  return _controllers
}

module.exports = ControllerManager
