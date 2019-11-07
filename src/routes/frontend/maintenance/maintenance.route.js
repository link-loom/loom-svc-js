function maintenance (dependencies) {
  // const _controllers = dependencies.controllers
  const _utilities = dependencies.utilities

  const index = (req, res) => {
    req.route.name = 'maintenance'
    req.route.handler = 'index'
    req.lookup = dependencies.geolocator.getLookup(req)
    const locale = dependencies.locale.international(req, res)
    if (!locale) {
      res.redirect('/maintenance?error=lang-not-found')
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
