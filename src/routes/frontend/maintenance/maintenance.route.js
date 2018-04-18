function maintenance (dependencies) {
  // const _database = dependencies.database
  const _utilities = dependencies.utilities

  const index = function (req, res) {
    _utilities.response.badRequestView(req, res, [])
  }

  return {
    index: index
  }
}

module.exports = maintenance
