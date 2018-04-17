function server (args) {
  const settings = require('./settings')(args)

  const startServer = () => {
    settings.initialize()

    /**
     * Listening on port
     */
    settings.dependencies().get().httpServer.listen(normalizePort(process.env.PORT || settings.dependencies().get().config.SERVER_PORT))
  }

  const normalizePort = (val) => {
    var port = parseInt(val, 10)

    if (isNaN(port)) return val
    if (port >= 0) return port
    return false
  }
  
  const getSettings = () => {
    return settings
  }

  return {
    start: startServer,
    settings: getSettings
  }
}

module.exports = server
