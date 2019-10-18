function route (dependencies) {
  const handler = (req, res) => {
    req.route.name = 'template'
    req.route.handler = 'handler'
    req.lookup = dependencies.geolocator.getLookup({ ip: req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress })
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
