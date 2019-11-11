class GeolocatorManager {
  constructor (dependencies) {
    this._dependencies = dependencies
    this._console = dependencies.console
    this._maxmind = dependencies.maxmind
  }

  async loadDatabases () {
    const database = `${this._dependencies.root}${this._dependencies.config.GEOIP_DATABASE.PATH}`

    this._lookup = await this._maxmind.open(database)
    this._console.success('Geolocate manager loaded')
  }

  getLookup (req) {
    if (!req) { return null }

    let ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress || '::1'

    if (ip === '::1') {
      // ONLY FOR TESTING, IS A COLOMBIAN IP
      ip = '190.147.120.104'
    }

    if (!this._maxmind.validate(ip)) {
      return null
    }

    return this._lookup.get(ip)
  }
}

module.exports = { GeolocatorManager }
