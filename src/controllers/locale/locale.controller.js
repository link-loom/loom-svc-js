function localeController (dependencies) {
  const _console = dependencies.console
  const _utilities = dependencies.utilities
  const countryCodes = require(`${dependencies.root}/src/locales/idd_codes`)

  const getAllIDDCountries = async () => {
    try {
      return _utilities.response.success(countryCodes || [])
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const getLocale = async (data) => {
    try {
      if (!data || !data.args.name || !data.args.handler || !data.args.lang) {
        return _utilities.response.error('Provide a controller name, handler and lang')
      }

      data.req.params.lang = data.args.lang
      data.req.route.name = data.args.name
      data.req.route.handler = data.args.handler
      data.req.lookup = { country: { iso_code: '' } }

      const locale = dependencies.locale.international(data.req)
      return _utilities.response.success(locale)
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  return {
    getAllIDDCountries,
    getLocale
  }
}

module.exports = localeController
