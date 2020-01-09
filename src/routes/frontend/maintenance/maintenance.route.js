function maintenance (dependencies) {
  const _utilities = dependencies.utilities

  const index = (req, res) => {
    req.route = { ...req.route, ...{ name: 'maintenance', handler: 'index' } }
    req.lookup = dependencies.geolocator.getLookup(req)
    const locale = dependencies.locale.international(req, res)
    if (!locale) {
      res.redirect('/maintenance?error=lang-not-found&code=501&message=Language%20localization%20not%20implemented%20and%20page%20is%20not%20accesible')
      return
    }

    _utilities.response.badRequestView(req, res, {
      title: 'Something was wrong',
      data: {
        locale,
        services: [
          '_services/notification/s-notification.js',
          '_services/user/s-user.js'
        ]
      },
      vue: '_views/maintenance/v-index.js'
    })
  }

  return {
    index
  }
}

module.exports = maintenance
