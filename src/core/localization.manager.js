function localization (dependencies) {
  /// Dependencies
  const _console = dependencies.console
  const fs = require('fs')

  const dictionaryFolder = `${dependencies.root}/src/locales/`
  let _locales

  const constructor = () => {
    _locales = {}

    return instantiateLocales()
  }

  const instantiateLocales = () => {
    const dictionaries = fs
      .readdirSync(dictionaryFolder, { withFileTypes: true })

    if (!dictionaries || dictionaries.length <= 0) {
      return null
    }

    dictionaries.map(locale => {
      const localeFilename = (locale.name || locale)

      if (localeFilename.includes('.locale')) {
        const localeFile = require(`${dependencies.root}/src/locales/${localeFilename}`)
        _locales[localeFile.country_iso_code.toLocaleLowerCase()] = localeFile
      }
    })

    _console.success('Localization imported')
  }

  const getLocales = (req, res) => {
    if (!req.params.lang) {
      if (!req.params) { req.params = {} }
      if (!req.lookup) { req.lookup = { country: { iso_code: '' } } }
      req.params = { lang: req.lookup.country.iso_code.toLocaleLowerCase() || 'us' }

      if (!req.cookie || !req.cookie.lang) {
        res.cookie('lang', req.lookup.country.iso_code.toLocaleLowerCase() || 'us', {
          expires: new Date(Date.now() + 9999999),
          httpOnly: false,
          path: '/'
        })
      }
    }

    let lang = req.lookup.country.iso_code.toLocaleLowerCase() || 'us'
    let locales = {}
    let locale = {}
    let components = {}
    if (req.params && req.params.lang) {
      lang = req.params.lang.toLocaleLowerCase()
    }

    if (!req.route.name || !req.route.handler) {
      return null
    }

    locale = _locales[lang]
    if (!locale) {
      locale = _locales.us
    }

    locales = (locale.dictionary[req.route.name][req.route.handler])
    components = (locale.dictionary.shared) || {}

    if (!locales) { return null }

    return { ...locales, ...components }
  }

  return {
    start: constructor,
    international: getLocales
  }
}

module.exports = localization
