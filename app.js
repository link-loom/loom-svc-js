/**
 * Boiler Plate Node.js App
 * v0.1.0
 */

const server = require('./src/core/server')({ root: __dirname })
server.start((dependencies) => {
  // Launching server
  dependencies.console.info(`http://localhost:${dependencies.config.SERVER_PORT}`, `Server`)
  dependencies.console.info(`${dependencies.config.SERVER_NAME} v${dependencies.config.SERVER_VERSION}`, `Server`)
  dependencies.console.log(' ------------------------------------')
})
