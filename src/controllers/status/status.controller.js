function statusController (dependencies) {
  const _utilities = dependencies.utilities

  const get = function (req, res) {
    return _utilities.response.success('API is online')
  }

  return {
    get: get
  }
}

module.exports = statusController
