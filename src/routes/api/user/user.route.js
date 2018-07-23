function user (dependencies) {
  const _utilities = dependencies.utilities
  const _controllers = dependencies.controllers

  /**
     * Get All
     *
     * route to show message (GET http://<<URL>>/api/user/getAll/)
     */
  const get = async (req, res) => {
    let result

    if (req.query && !_utilities.objectIsEmpty(req.query)) {
      // Map all object into individual variables
      const { id, username } = req.query

      if (id) {
        result = await _controllers.user.getById(req.query)
      } else if (username) {
        result = await _controllers.user.getByUsername(req.query)
      } else {
        result = await _controllers.user.getAll(req.query)
      }
    } else {
      result = await _controllers.user.getAll(req.query)
    }

    res.json(result)
  }

  /**
   * Create user
   *
   * route to show message (POST http://<<URL>>/api/user/create)
   */
  const create = async (req, res) => {
    let result = await _controllers.user.create(req.body)

    res.json(result)
  }

  /**
     * Partial update
     *
     * route to show message (POST http://<<URL>>/api/user/update)
     */
  const update = async (req, res) => {
    let result = await _controllers.user.update(req.body)

    res.json(result)
  }

  /**
     * Update or create
     *
     * route to show message (POST http://<<URL>>/api/user/update)
     */
  const updateOrCreate = async (req, res) => {
    let result = await _controllers.user.updateOrCreate(req.body)

    res.json(result)
  }

  const remove = async (req, res) => {
    let result = await _controllers.user.remove(req.body)

    res.json(result)
  }

  return {
    get,
    create,
    update,
    updateOrCreate,
    remove
  }
}

module.exports = user
