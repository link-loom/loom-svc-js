function route (dependencies) {
  const _utilities = dependencies.utilities
  const _controllers = dependencies.controllers

  /**
     * Get All
     *
     * route to show message (GET http://<<URL>>/api/combo/)
     */
  const getAllIDDCountries = async (req, res) => {
    const params = _utilities.request.getParameters(req)
    const result = await _controllers.locale.getAllIDDCountries(params)

    res.json(result)
  }

  /**
     * Get By id
     *
     * route to show message (GET http://<<URL>>/api/combo/:id)
     */
  const getLocale = async (req, res) => {
    const params = _utilities.request.getParameters(req)
    const result = await _controllers.locale.getLocale({ args: params, req })

    res.json(result)
  }

  const getAllLocales = async (req, res) => {
    const params = _utilities.request.getParameters(req)
    const result = await _controllers.locale.getAllLocales({ args: params, req })

    res.json(result)
  }

  return {
    getAllIDDCountries,
    getLocale,
    getAllLocales
  }
}

module.exports = route
