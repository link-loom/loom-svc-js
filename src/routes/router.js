const router = {
  frontend: [
    { httpRoute: '/', route: '/routes/frontend/home/home.route', handler: 'index' },
    { httpRoute: '/robots.txt', route: '/routes/frontend/seo/seo.route', handler: 'robots' },
    { httpRoute: '/sitemap/master.xml', route: '/routes/frontend/seo/seo.route', handler: 'sitemapMaster' },
    { httpRoute: '/sitemap/latest.xml', route: '/routes/frontend/seo/seo.route', handler: 'sitemapLatest' }
  ],
  api: [
    { httpRoute: '/status', route: '/routes/api/status/status.route', handler: 'get', method: 'GET', protected: false },
    { httpRoute: '/users/', route: '/routes/api/user/user.route', handler: 'get', method: 'GET', protected: false },
    { httpRoute: '/users/:id', route: '/routes/api/user/user.route', handler: 'get', method: 'GET', protected: true },
    { httpRoute: '/users/', route: '/routes/api/user/user.route', handler: 'create', method: 'POST', protected: false },
    { httpRoute: '/users/', route: '/routes/api/user/user.route', handler: 'update', method: 'PATCH', protected: true },
    { httpRoute: '/users/', route: '/routes/api/user/user.route', handler: 'updateOrCreate', method: 'PUT', protected: true },
    { httpRoute: '/login/user/', route: '/routes/api/login/login.route', handler: 'user', method: 'POST', protected: false }
  ]
}

module.exports = router
