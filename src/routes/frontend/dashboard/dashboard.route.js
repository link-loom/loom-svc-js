function dashboard (dependencies) {
  const index = (req, res) => {
    req.route.name = 'dashboard'
    req.route.handler = 'index'
    req.lookup = dependencies.geolocator.getLookup(req)
    const locale = dependencies.locale.international(req, res)
    if (!locale) {
      res.redirect('/maintenance?error=lang-not-found&code=501&message=Language%20localization%20not%20implemented%20and%20page%20is%20not%20accesible')
      return
    }

    res.render('dashboard/index.view.jsx', {
      title: 'dashboard',
      data: {
        locale,
        services: [
          '_services/notification/s-notification.js',
          '_services/user/s-user.js'
        ]
      },
      vue: '_views/dashboard/v-index.js'
    })
  }

  return {
    index
  }
}

module.exports = dashboard
