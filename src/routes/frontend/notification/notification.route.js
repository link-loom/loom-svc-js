function route (dependencies) {
  const list = (req, res) => {
    req.route = { ...req.route, ...{ name: 'notification', handler: 'list' } }
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

    res.render('notification/list.view.jsx', {
      data: {
        locale,
        services: [
          '_services/notification/s-notification.js',
          '_services/user/s-user.js'
        ]
      },
      vue: '_views/notification/v-list.js'
    })
  }

  const compose = (req, res) => {
    req.route = { ...req.route, ...{ name: 'notification', handler: 'create' } }
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

    res.render('notification/compose.view.jsx', {
      data: {
        locale,
        services: [
          '_services/notification/s-notification.js',
          '_services/user/s-user.js'
        ]
      },
      vue: '_views/notification/v-compose.js'
    })
  }

  return {
    list,
    compose
  }
}

module.exports = route
