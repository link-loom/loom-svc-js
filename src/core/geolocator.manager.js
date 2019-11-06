function localization (dependencies) {
  /// Dependencies
  const _console = dependencies.console
  const _maxmind = dependencies.maxmind
  let _lookup

  const constructor = async () => {
    _lookup = {}

    return instantiateLocales()
  }

  const instantiateLocales = async () => {
    const database = `${dependencies.root}${dependencies.config.GEOIP_DATABASE.PATH}`

    _lookup = await _maxmind.open(database)
    _console.success('Geolocate imported')

    return _lookup
  }

  const getLookup = (req) => {
    if (!req) { return null }

    let ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress || '::1'

    if (ip === '::1') {
      // ONLY FOR TESTING, IS A COLOMBIAN IP
      ip = '190.147.120.104'
    }

    if (!_maxmind.validate(ip)) {
      return null
    }

    return _lookup.get(ip)
  }

  return {
    start: constructor,
    getLookup
  }
}

module.exports = localization
