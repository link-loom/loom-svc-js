function ControllerManager (dependencies) {
  /// Dependencies
  const _console = dependencies.console
  const { lstatSync, readdirSync } = require('fs')
  const { join } = require('path')

  /// Properties
  let _controllers = {}

  try {
    // Read all directories in controllers folder
    const isDirectory = source => lstatSync(source).isDirectory()
    const getDirectories = source =>
      readdirSync(source).map(name => join(source, name)).filter(isDirectory)

    const directories = getDirectories(`${dependencies.root}/src/controllers/`)

    // Map all controllers
    directories.map((path) => {
      try {
        if (path) {
          let name = path.split('\\')[path.split('\\').length - 1]
          let pathName = `${path}\\${name}.controller`
          // self and dynamic propagation
          dependencies.controllers = _controllers
          _controllers[name] = require(pathName)(dependencies)
        }
      } catch (error) {
        _console.error(`Error on path ${path}`)
        _console.error(error)
      }
    })
  } catch (error) {
    _console.error(error)
  }

  return _controllers
}

module.exports = ControllerManager
