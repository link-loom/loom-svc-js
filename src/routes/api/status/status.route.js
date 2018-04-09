function status (dependencies) {
  const _utilities = dependencies.utilities

  /**
     * Status
     *
     * route to show message (GET http://<<URL>>/api/Status)
     */
  const get = function (req, res) {
    res.json(_utilities.response.success('API is online'))
  }

  return {
    get: get
  }
}

module.exports = status
