function home (dependencies) {
  // const _database = dependencies.database
  const _utilities = dependencies.utilities

  const index = (req, res) => {
    req.route = { ...req.route, ...{ name: 'home', handler: 'index' } }
    req.lookup = dependencies.geolocator.getLookup(req)
    const locale = dependencies.locale.international(req, res)
    if (!locale) {
      res.redirect('/maintenance?error=lang-not-found&code=501&message=Language%20localization%20not%20implemented%20and%20page%20is%20not%20accesible')
      return
    }

    res.render('home/index.view.jsx', {
      title: 'Home',
      data: {
        locale,
        services: [
          '_services/notification/s-notification.js',
          '_services/user/s-user.js'
        ]
      },
      vue: '_views/home/v-index.js'
    })
  }

  const dashboard = (req, res) => {
    // FIXME: Example of cookies
    if (!req.cookies.user_session) {
      res.redirect('/login')
      return
    }

    // FIXME: Example of bad request response
    _utilities.request.badRequestView(req, res, {})
  }

  return {
    index,
    dashboard
  }
}

module.exports = home
