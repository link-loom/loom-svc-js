function auth (dependencies) {
  const _utilities = dependencies.utilities
  const _controllers = dependencies.controllers
  const _auth = dependencies.auth

  const login = (req, res) => {
    req.route.name = 'auth'
    req.route.handler = 'login'
    req.lookup = dependencies.geolocator.getLookup(req)
    const locale = dependencies.locale.international(req, res)
    if (!locale) {
      res.redirect('/maintenance?error=lang-not-found&code=501&message=Language%20localization%20not%20implemented%20and%20page%20is%20not%20accesible')
      return
    }

    if (!req.cookies.user_session) {
      res.render('auth/login.view.jsx', {
        title: 'Signin',
        data: {
          locale,
          services: [
            '_services/auth/s-auth.js'
          ]
        },
        vue: '_views/auth/v-login.js'
      })
    } else {
      res.redirect('/')
    }
  }

  const signup = (req, res) => {
    req.route.name = 'auth'
    req.route.handler = 'signup'
    req.lookup = dependencies.geolocator.getLookup(req)
    const locale = dependencies.locale.international(req, res)
    if (!locale) {
      res.redirect('/maintenance?error=lang-not-found&code=501&message=Language%20localization%20not%20implemented%20and%20page%20is%20not%20accesible')
      return
    }

    if (!req.cookies.user_session) {
      res.render('auth/signup.view.jsx', {
        title: 'Signup',
        data: {
          locale,
          services: [
            '_services/auth/s-auth.js',
            '_services/user/s-user.js',
            '_services/locale/s-locale.js'
          ]
        },
        vue: '_views/auth/v-signup.js'
      })
    } else {
      res.redirect('/')
    }
  }

  const confirmAccount = async (req, res) => {
    req.route.name = 'auth'
    req.route.handler = 'confirmAccount'
    req.lookup = dependencies.geolocator.getLookup(req)
    const locale = dependencies.locale.international(req, res)
    if (!locale) {
      res.redirect('/maintenance?error=lang-not-found&code=501&message=Language%20localization%20not%20implemented%20and%20page%20is%20not%20accesible')
      return
    }

    res.render('auth/confirm-account.view.jsx', {
      title: 'Verify your email address',
      description: 'Please check your {{vueBind.model.email}} inbox to confirm your account.',
      data: {
        locale,
        services: [
          '_services/auth/s-auth.js'
        ]
      },
      vue: '_views/auth/v-confirm-account.js'
    })
  }

  const validateEmail = async (req, res) => {
    req.route.name = 'auth'
    req.route.handler = 'validateEmail'
    req.lookup = dependencies.geolocator.getLookup(req)
    const locale = dependencies.locale.international(req, res)
    if (!locale) {
      res.redirect('/maintenance?error=lang-not-found&code=501&message=Language%20localization%20not%20implemented%20and%20page%20is%20not%20accesible')
      return
    }

    if (req.query &&
      req.query[_auth.encoder.base64.encode('timestamp')] &&
      req.query[_auth.encoder.base64.encode('token')]) {
      const result = await _controllers.auth.validateEmail({
        timestamp: req.query[_auth.encoder.base64.encode('timestamp')],
        token: req.query[_auth.encoder.base64.encode('token')]
      })

      if (_utilities.response.isValid(result)) {
        res.redirect('/login?emailConfirmed=true')
      } else {
        // TODO: Improve to show a dedicated view
        _utilities.response.badRequestView(req, res)
      }
    } else {
      _utilities.response.badRequestView(req, res)
    }
  }

  return {
    login,
    signup,
    confirmAccount,
    validateEmail
  }
}

module.exports = auth
