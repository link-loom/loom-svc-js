function route (dependencies) {
  const handler = (req, res) => {
    req.route.name = 'template'
    req.route.handler = 'handler'
    req.lookup = dependencies.geolocator.getLookup(req)
    const locale = dependencies.locale.international(req, res)
    if (!locale) { return }

    if (req.cookies.user_session) {
      res.render('folder/template.view.jsx', {
        title: '[Page Title]',
        data: {
          locale,
          services: []
        },
        vue: '_views/folder/v-template.js'
      })
    } else {
      res.redirect('/login')
    }
  }

  return {
    handler
  }
}

module.exports = route
