function route (dependencies) {
  const create = (req, res) => {
    req.route = { ...req.route, ...{ name: 'user', handler: 'create' } }
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

    res.render('user/create.view.jsx', {
      data: {
        locale,
        services: [
          '_services/notification/s-notification.js',
          '_services/role/s-role.js',
          '_services/user/s-user.js'
        ]
      },
      vue: '_views/user/v-create.js'
    })
  }

  const list = (req, res) => {
    req.route = { ...req.route, ...{ name: 'user', handler: 'list' } }
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

    res.render('user/list.view.jsx', {
      data: {
        locale,
        services: [
          '_services/notification/s-notification.js',
          '_services/user/s-user.js'
        ]
      },
      vue: '_views/user/v-list.js'
    })
  }

  const edit = (req, res) => {
    req.route = { ...req.route, ...{ name: 'user', handler: 'edit' } }
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

    res.render('user/edit.view.jsx', {
      data: {
        locale,
        services: [
          '_services/notification/s-notification.js',
          '_services/role/s-role.js',
          '_services/user/s-user.js'
        ]
      },
      vue: '_views/user/v-edit.js'
    })
  }

  const block = (req, res) => {
    req.route = { ...req.route, ...{ name: 'user', handler: 'block' } }
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

    res.render('user/block.view.jsx', {
      data: {
        locale,
        services: [
          '_services/notification/s-notification.js',
          '_services/user/s-user.js'
        ]
      },
      vue: '_views/user/v-block.js'
    })
  }

  const uDelete = (req, res) => {
    req.route = { ...req.route, ...{ name: 'user', handler: 'delete' } }
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

    res.render('user/delete.view.jsx', {
      data: {
        locale,
        services: [
          '_services/notification/s-notification.js',
          '_services/user/s-user.js'
        ]
      },
      vue: '_views/user/v-delete.js'
    })
  }

  const detail = (req, res) => {
    req.route = { ...req.route, ...{ name: 'user', handler: 'create' } }
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

    res.render('user/detail.view.jsx', {
      data: {
        locale,
        services: [
          '_services/notification/s-notification.js',
          '_services/user/s-user.js'
        ]
      },
      vue: '_views/user/v-detail.js'
    })
  }

  return {
    create,
    list,
    edit,
    block,
    uDelete,
    detail
  }
}

module.exports = route
