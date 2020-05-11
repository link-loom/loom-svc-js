function route (dependencies) {
  const handler = (req, res) => {
    req.route = { ...req.route, ...{ name: 'template', handler: 'handler' } }
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

    res.render('folder/template.view.jsx', {
      data: {
        locale,
        services: []
      },
      vue: '_views/folder/v-template.js'
    })
  }

  return {
    handler
  }
}

module.exports = route
