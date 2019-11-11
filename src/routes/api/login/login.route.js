function login (dependencies) {
  const _utilities = dependencies.utilities
  const _database = dependencies.database

  /**
     * Login user
     *
     * route to show message (POST http://<<URL>>/api/login/:id)
     */
  const user = async (req, res) => {
    if (req.body) {
      const result = await _database.entities.login.user(req.body)

      res.json(result)
    } else {
      return _utilities.response.error('Please provide required data')
    }
  }

  const logout = async (req, res) => {
    const result = await _database.entities.login.logout()

    res.json(result)
  }

  return {
    user,
    logout
  }
}

module.exports = login
