const router = {
  api: [
    { httpRoute: '/status', route: '/routes/api/status/status.route', handler: 'get', method: 'GET', protected: false },
    // Upload files
    { httpRoute: '/upload/file', route: '/routes/api/upload/upload.route', handler: 'upload', method: 'POST', protected: false, isUpload: true },
    { httpRoute: '/upload/bulk', route: '/routes/api/upload/upload.route', handler: 'bulk', method: 'POST', protected: false, isUpload: true },
    // Auth
    { httpRoute: '/login', route: '/routes/api/auth/auth.route', handler: 'login', method: 'POST', protected: false },
    { httpRoute: '/logout', route: '/routes/api/auth/auth.route', handler: 'logout', method: 'POST', protected: false },
    { httpRoute: '/validate-email/', route: '/routes/api/auth/auth.route', handler: 'validateEmail', method: 'POST', protected: false },
    { httpRoute: '/validate-account-chatbot', route: '/routes/api/auth/auth.route', handler: 'validateAccountChatbot', method: 'POST', protected: false },
    // Locale
    { httpRoute: '/locale/', route: '/routes/api/locale/locale.route', handler: 'getAllLocales', method: 'GET', protected: false },
    { httpRoute: '/locale/get-idd-countries/', route: '/routes/api/locale/locale.route', handler: 'getAllIDDCountries', method: 'GET', protected: false },
    { httpRoute: '/locale/get-locale/', route: '/routes/api/locale/locale.route', handler: 'getLocale', method: 'GET', protected: false },
    // Notification
    { httpRoute: '/notification/', route: '/routes/api/notification/notification.route', handler: 'get', method: 'GET', protected: false },
    { httpRoute: '/notification/', route: '/routes/api/notification/notification.route', handler: 'create', method: 'POST', protected: false },
    { httpRoute: '/notification/', route: '/routes/api/notification/notification.route', handler: 'update', method: 'PATCH', protected: false },
    // User
    { httpRoute: '/user/', route: '/routes/api/user/user.route', handler: 'get', method: 'GET', protected: false },
    { httpRoute: '/user/', route: '/routes/api/user/user.route', handler: 'create', method: 'POST', protected: false },
    { httpRoute: '/user/', route: '/routes/api/user/user.route', handler: 'update', method: 'PATCH', protected: false }
  ],
  frontend: [
    { httpRoute: '/', route: '/routes/frontend/home/home.route', handler: 'index' },
    { httpRoute: '/robots.txt', route: '/routes/frontend/seo/seo.route', handler: 'robots' },
    { httpRoute: '/sitemap/master.xml', route: '/routes/frontend/seo/seo.route', handler: 'sitemapMaster' },
    { httpRoute: '/sitemap/latest.xml', route: '/routes/frontend/seo/seo.route', handler: 'sitemapLatest' },
    // Auth
    { httpRoute: '/:lang?/login', route: '/routes/frontend/auth/auth.route', handler: 'login' },
    { httpRoute: '/:lang?/signup', route: '/routes/frontend/auth/auth.route', handler: 'signup' },
    { httpRoute: '/:lang?/confirm-account', route: '/routes/frontend/auth/auth.route', handler: 'confirmAccount' },
    { httpRoute: '/:lang?/validate-email', route: '/routes/frontend/auth/auth.route', handler: 'validateEmail' },
    // Dashboard
    { httpRoute: '/:lang?/dashboard', route: '/routes/frontend/dashboard/dashboard.route', handler: 'index' },
    // Account
    { httpRoute: '/:lang?/account/getting-started', route: '/routes/frontend/account/account.route', handler: 'gettingStarted' },
    { httpRoute: '/:lang?/account/profile/', route: '/routes/frontend/account/account.route', handler: 'profile' },
    { httpRoute: '/:lang?/account/overview/', route: '/routes/frontend/account/account.route', handler: 'overview' },
    // User
    { httpRoute: '/:lang?/user/create/', route: '/routes/frontend/user/user.route', handler: 'create' },
    { httpRoute: '/:lang?/user/list/', route: '/routes/frontend/user/user.route', handler: 'list' },
    { httpRoute: '/:lang?/user/edit/', route: '/routes/frontend/user/user.route', handler: 'edit' },
    { httpRoute: '/:lang?/user/detail/', route: '/routes/frontend/user/user.route', handler: 'detail' },
    { httpRoute: '/:lang?/user/block/', route: '/routes/frontend/user/user.route', handler: 'block' },
    { httpRoute: '/:lang?/user/delete/', route: '/routes/frontend/user/user.route', handler: 'uDelete' }
  ]
}

module.exports = router
