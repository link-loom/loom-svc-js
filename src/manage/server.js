function server (args) {
  const settings = require('./settings')(args)

  const startServer = () => {
    settings.initialize()

    /**
     * Listening on port
     */
    settings.dependencies().get().httpServer.listen(normalizePort(process.env.PORT || settings.dependencies().get().config.ServerPort))
  }

  const normalizePort = (val) => {
    var port = parseInt(val, 10)

    if (isNaN(port)) return val
    if (port >= 0) return port
    return false
  }

  const responseError = function (message) {
    if (message) {
      return { success: false, message: message, result: null }
    } else {
      return { success: false, message: 'Something was wrong while you make this action', result: null }
    }
  }

  const responseSuccess = function (data, message) {
    if (message) {
      return {
        success: true,
        message: message,
        result: data
      }
    } else {
      return {
        success: true,
        message: 'Operation completed succesfuly',
        result: data
      }
    }
  }

  const sendBadRequestView = function (req, res) {
    res.render('maintenance/maintenance.view.jsx', null)
  }

  const getSettings = () => {
    return settings
  }

  return {
    start: startServer,
    response: {
      error: responseError,
      success: responseSuccess,
      badRequestView: sendBadRequestView
    },
    settings: getSettings
  }
}

module.exports = server
