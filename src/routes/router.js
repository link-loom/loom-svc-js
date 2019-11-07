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
    // Upload files
    { httpRoute: '/upload', route: '/routes/api/upload/upload.route', handler: 'upload', method: 'POST', protected: false, isUpload: true },
    { httpRoute: '/upload/bulk', route: '/routes/api/upload/upload.route', handler: 'bulk', method: 'POST', protected: false, isUpload: true },
    // Auth
    { httpRoute: '/login', route: '/routes/api/auth/auth.route', handler: 'login', method: 'POST', protected: false },
    { httpRoute: '/logout', route: '/routes/api/auth/auth.route', handler: 'logout', method: 'POST', protected: false },
    { httpRoute: '/validate-email/', route: '/routes/api/auth/auth.route', handler: 'validateEmail', method: 'POST', protected: false },
    { httpRoute: '/validate-account-chatbot', route: '/routes/api/auth/auth.route', handler: 'validateAccountChatbot', method: 'POST', protected: false }
  ]
}

module.exports = router
