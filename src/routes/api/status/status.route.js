function status (dependencies) {
  const _utilities = dependencies.utilities

  const controller = require(`${dependencies.root}/src/controllers/status/statusController`)(dependencies)

  /**
     * Status
     *
     * route to show message (GET http://<<URL>>/api/Status)
     */
  const get = function (req, res) {
    res.json(controller.get())
  }

  return {
    get: get
  }
}

module.exports = status
