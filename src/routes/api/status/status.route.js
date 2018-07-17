function status (dependencies) {
  // Direct calling, not recommended
  // because this controller have full access to database or sensitive data.
  // At this point you can add an additional security layer or flow layer, also
  // you need to add every controller you need, if you use "controllers" dependency
  // all controllers contained in /src/controllers are injected
  const controller = require(`${dependencies.root}/src/controllers/status/statusController`)(dependencies)

  /**
     * Status
     *
     * route to show message (GET http://<<URL>>/api/status)
     */
  const get = function (req, res) {
    res.json(controller.get())
  }

  return {
    get: get
  }
}

module.exports = status
