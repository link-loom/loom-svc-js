function statusController (dependencies) {
  const _utilities = dependencies.utilities

  const get = async (req, res) => {
    return _utilities.response.success('API is online')
  }

  return {
    get
  }
}

module.exports = statusController
