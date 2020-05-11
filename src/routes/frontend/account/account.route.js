function route (dependencies) {
  const gettingStarted = (req, res) => {
    req.route = { ...req.route, ...{ name: 'account', handler: 'getting-started' } }
    req.lookup = dependencies.geolocator.getLookup(req)
    const locale = dependencies.locale.international(req, res)

    if (!req.cookies.user_session) {
      res.redirect((`/login?redirect=${encodeURIComponent(`/${req.route.name}/${req.route.handler}`)}`))
      return
    }

    if (!locale) {
      res.redirect('/maintenance?error=lang-not-found&code=501&message=Language%20localization%20not%20implemented%20and%20page%20is%20not%20accesible')
      return
    }

    res.render('dashboard/getting-started.view.jsx', {
      data: {
        locale,
        services: [
          '_services/notification/s-notification.js',
          '_services/user/s-user.js',
          '_services/business/s-business.js'
        ]
      },
      vue: '_views/dashboard/v-getting-started.js'
    })
  }

  const profile = (req, res) => {
    req.route = { ...req.route, ...{ name: 'account', handler: 'profile' } }
    req.lookup = dependencies.geolocator.getLookup(req)
    const locale = dependencies.locale.international(req, res)

    if (!req.cookies.user_session) {
      res.redirect((`/login?redirect=${encodeURIComponent(`/${req.route.name}/${req.route.handler}`)}`))
      return
    }

    if (!locale) {
      res.redirect('/maintenance?error=lang-not-found&code=501&message=Language%20localization%20not%20implemented%20and%20page%20is%20not%20accesible')
      return
    }

    res.render('account/profile.view.jsx', {
      data: {
        locale,
        services: [
          '_services/notification/s-notification.js',
          '_services/user/s-user.js'
        ]
      },
      vue: '_views/account/v-profile.js'
    })
  }

  const overview = (req, res) => {
    req.route = { ...req.route, ...{ name: 'account', handler: 'overview' } }
    req.lookup = dependencies.geolocator.getLookup(req)
    const locale = dependencies.locale.international(req, res)

    if (!req.cookies.user_session) {
      res.redirect((`/login?redirect=${encodeURIComponent(`/${req.route.name}/${req.route.handler}`)}`))
      return
    }

    if (!locale) {
      res.redirect('/maintenance?error=lang-not-found&code=501&message=Language%20localization%20not%20implemented%20and%20page%20is%20not%20accesible')
      return
    }

    res.render('account/overview.view.jsx', {
      data: {
        locale,
        services: [
          '_services/notification/s-notification.js',
          '_services/user/s-user.js',
          '_Services/locale/s-locale.js'
        ]
      },
      vue: '_views/account/v-overview.js'
    })
  }

  return {
    gettingStarted,
    profile,
    overview
  }
}

module.exports = route
