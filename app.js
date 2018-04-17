/**
 * Boiler Plate Node.js App
 * v0.1.0
 */

const server = require('./src/core/server')({ root: __dirname })
server.start()

var settings = server.settings()
settings.dependencies().add(server, 'server')

// Initialize all app
const main = require('./src/controllers/main')(settings.dependencies().get())

main.start(() => {
  // Launching server
  console.log(` ${settings.dependencies().get().colors.cyan(`Server:`)} http://localhost:${settings.dependencies().get().config.SERVER_PORT}`)
  console.log(` ${settings.dependencies().get().colors.cyan(`Server:`)} ${settings.dependencies().get().config.SERVER_NAME} v${settings.dependencies().get().config.SERVER_VERSION}`)
  console.log(' ------------------------------------')
})
