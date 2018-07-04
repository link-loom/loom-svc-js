let router = {
  frontend: [
    { httpRoute: '/', route: '/routes/frontend/home/home.route', handler: 'index' },
    { httpRoute: '/robots.txt', route: '/routes/frontend/seo/seo.route', handler: 'robots' },
    { httpRoute: '/sitemap/master.xml', route: '/routes/frontend/seo/seo.route', handler: 'sitemapMaster' },
    { httpRoute: '/sitemap/latest.xml', route: '/routes/frontend/seo/seo.route', handler: 'sitemapLatest' }
  ],
  api: [
    { httpRoute: '/status', route: '/routes/api/status/status.route', handler: 'get', method: 'GET', protected: false },
    { httpRoute: '/user/getAll/', route: '/routes/api/user/user.route', handler: 'getAll', method: 'GET', protected: true },
    { httpRoute: '/user/getById/:userId', route: '/routes/api/user/user.route', handler: 'getById', method: 'GET', protected: false },
    { httpRoute: '/user/create/', route: '/routes/api/user/user.route', handler: 'create', method: 'POST', protected: false },
    { httpRoute: '/user/update/', route: '/routes/api/user/user.route', handler: 'update', method: 'POST', protected: true },
  ]
}

module.exports = router
