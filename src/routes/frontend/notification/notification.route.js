function route (dependencies) {
  const list = (req, res) => {
    req.route.name = 'notification'
    req.route.handler = 'list'
    req.lookup = dependencies.geolocator.getLookup(req)
    const locale = dependencies.locale.international(req, res)
    if (!locale) {
      res.redirect('/maintenance?error=lang-not-found&code=501&message=Language%20localization%20not%20implemented%20and%20page%20is%20not%20accesible')
      return
    }

    if (req.cookies.user_session) {
      res.render('notification/list.view.jsx', {
        title: 'Notifications',
        data: {
          locale,
          services: [
            '_services/notification/s-notification.js',
            '_services/user/s-user.js'
          ]
        },
        vue: '_views/notification/v-list.js'
      })
    } else {
      res.redirect('/login')
    }
  }

  const compose = (req, res) => {
    req.route.name = 'notification'
    req.route.handler = 'create'
    req.lookup = dependencies.geolocator.getLookup(req)
    const locale = dependencies.locale.international(req, res)
    if (!locale) {
      res.redirect('/maintenance?error=lang-not-found&code=501&message=Language%20localization%20not%20implemented%20and%20page%20is%20not%20accesible')
      return
    }

    if (req.cookies.user_session) {
      res.render('notification/compose.view.jsx', {
        title: 'Crea comunicados',
        data: {
          locale,
          services: [
            '_services/notification/s-notification.js',
            '_services/user/s-user.js'
          ]
        },
        vue: '_views/notification/v-compose.js'
      })
    } else {
      res.redirect('/login')
    }
  }

  return {
    list,
    compose
  }
}

module.exports = route
