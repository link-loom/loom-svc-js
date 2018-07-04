function user (dependencies) {
  const _utilities = dependencies.utilities
  const _database = dependencies.database

  /**
     * Get All
     *
     * route to show message (GET http://<<URL>>/api/user/getAll/)
     */
  const get = async (req, res) => {
    let result = await _database.entities.user.getAll()

    res.json(result)
  }

  /**
     * Get By id
     *
     * route to show message (GET http://<<URL>>/api/user/getById/:id)
     */
  const getById = async (req, res) => {
    if (req.params) {
      let result = await _database.entities.user.getById(req.params)

      res.json(result)
    } else {
      return _utilities.response.error('Please provide required data')
    }
  }

  /**
   * Create user
   *
   * route to show message (POST http://<<URL>>/api/user/create)
   */
  const create = async (req, res) => {
    let result = await _database.entities.user.create(req.body)

    res.json(result)
  }

  /**
     * Update
     *
     * route to show message (POST http://<<URL>>/api/user/update)
     */
  const update = async (req, res) => {
    let result = await _database.entities.user.update(req.body)

    res.json(result)
  }

  return {
    getAll: get,
    getById,
    create,
    update
  }
}

module.exports = user
