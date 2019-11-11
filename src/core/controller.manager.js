class ControllerManager {
  constructor (dependencies) {
    this._dependencies = dependencies
    this._console = dependencies.console

    this.loadControllers()
  }

  loadControllers () {
    const { lstatSync, readdirSync } = require('fs')
    const { join } = require('path')
    this._controllers = {}

    try {
      // Read all directories in controllers folder
      const isDirectory = source => lstatSync(source).isDirectory()
      const getDirectories = source =>
        readdirSync(source).map(name => join(source, name)).filter(isDirectory)

      const directories = getDirectories(`${this._dependencies.root}/src/controllers/`)

      // Map all controllers
      directories.map((path) => {
        try {
          if (path) {
            const name = path.split('\\')[path.split('\\').length - 1]
            const pathName = `${path}\\${name}.controller`
            // self and dynamic propagation
            this._dependencies.controllers = this._controllers
            this._controllers[name] = require(pathName)(this._dependencies)
          }
        } catch (error) {
          this._console.error(`Error on path ${path}`)
          this._console.error(error)
        }
      })
    } catch (error) {
      this._console.error(error)
    }
  }

  get controllers () {
    return this._controllers
  }
}

module.exports = { ControllerManager }
