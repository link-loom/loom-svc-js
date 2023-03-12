/**
 * Main start
 *
 * To read documentation go to https://github.com/thepisode/beat/wiki
 */

const { ServerManager } = require('./src/core/server.manager')
const server = new ServerManager({ root: __dirname })

const main = async () => {
  const namespace = '[Server]'
  const dependencies = await server.load()

  // Launching server
  dependencies.console.info(`http://localhost:${dependencies.config.SERVER.PORT}/`, { namespace })
  dependencies.console.info(`http://localhost:${dependencies.config.SERVER.PORT}/open-api.playground`, { namespace })
  dependencies.console.info(`http://localhost:${dependencies.config.SERVER.PORT}/open-api.json`, { namespace })
  dependencies.console.info(`${dependencies.config.SERVER.NAME} v${dependencies.config.SERVER.VERSION}`, { namespace })
  dependencies.console.log(' ------------------------------------')
}

main()
