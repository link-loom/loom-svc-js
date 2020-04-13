class LocalizationManager {
  constructor (dependencies) {
    this._dependencies = dependencies
    this._console = dependencies.console

    this._locales = {}

    this.loadLocales()

    this._console.success('Localization manager loaded')
  }

  getAllLocales () {
    return this._locales
  }

  loadLocales () {
    const dictionaryFolder = `${this._dependencies.root}/src/locales/`
    const fs = require('fs')

    const dictionaries = fs
      .readdirSync(dictionaryFolder, { withFileTypes: true })

    if (!dictionaries || dictionaries.length <= 0) {
      return null
    }

    dictionaries.map(locale => {
      const localeFilename = (locale.name || locale)

      if (localeFilename.includes('.locale')) {
        const localeFile = require(`${this._dependencies.root}/src/locales/${localeFilename}`)
        this._locales[localeFile.country_iso_code.toLocaleLowerCase()] = localeFile
      }
    })
  }

  international (req, res) {
    try {
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

      locale = this._locales[lang]
      if (!locale) {
        locale = this._locales.us
      }

      locales = (locale.dictionary[req.route.name][req.route.handler])
      components = (locale.dictionary.shared) || {}

      if (!locales) { return null }

      return { ...locales, ...components }
    } catch (error) {
      return null
    }
  }
}

module.exports = { LocalizationManager }
