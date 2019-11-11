function home (dependencies) {
  // const _database = dependencies.database
  const _utilities = dependencies.utilities

  const index = (req, res) => {
    req.route.name = 'home'
    req.route.handler = 'index'
    req.lookup = dependencies.geolocator.getLookup(req)
    const locale = dependencies.locale.international(req, res)
    if (!locale) {
      res.redirect('/maintenance?error=lang-not-found')
      return
    }

    res.render('index/index.view.jsx', {
      title: 'Home',
      data: {
        locale,
        services: [
          '_services/notification/s-notification.js',
          '_services/user/s-user.js'
        ]
      },
      vue: '_views/home/v-home.js'
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
