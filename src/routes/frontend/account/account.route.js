function route (dependencies) {
  const gettingStarted = (req, res) => {
    req.route.name = 'account'
    req.route.handler = 'getting-started'
    req.lookup = dependencies.geolocator.getLookup(req)
    const locale = dependencies.locale.international(req, res)
    if (!locale) {
      res.redirect('/maintenance?error=lang-not-found&code=501&message=Language%20localization%20not%20implemented%20and%20page%20is%20not%20accesible')
      return
    }

    if (req.cookies.user_session) {
      res.render('dashboard/getting-started.view.jsx', {
        title: 'Setup your business',
        description: 'Give us information about your store to configure and provide the better experience',
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
    } else {
      res.redirect('/login')
    }
  }

  const profile = (req, res) => {
    req.route.name = 'account'
    req.route.handler = 'profile'
    req.lookup = dependencies.geolocator.getLookup(req)
    const locale = dependencies.locale.international(req, res)
    if (!locale) {
      res.redirect('/maintenance?error=lang-not-found&code=501&message=Language%20localization%20not%20implemented%20and%20page%20is%20not%20accesible')
      return
    }

    if (req.cookies.user_session) {
      res.render('account/profile.view.jsx', {
        title: 'Edit your profile',
        description: '',
        data: {
          locale,
          services: [
            '_services/notification/s-notification.js',
            '_services/user/s-user.js'
          ]
        },
        vue: '_views/account/v-profile.js'
      })
    } else {
      res.redirect('/login')
    }
  }

  const overview = (req, res) => {
    req.route.name = 'account'
    req.route.handler = 'overview'
    req.lookup = dependencies.geolocator.getLookup(req)
    const locale = dependencies.locale.international(req, res)
    if (!locale) {
      res.redirect('/maintenance?error=lang-not-found&code=501&message=Language%20localization%20not%20implemented%20and%20page%20is%20not%20accesible')
      return
    }

    if (req.cookies.user_session) {
      res.render('account/overview.view.jsx', {
        title: 'Account overview',
        description: '',
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
    } else {
      res.redirect('/login')
    }
  }

  return {
    gettingStarted,
    profile,
    overview
  }
}

module.exports = route
