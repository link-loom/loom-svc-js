const router = {
  system: [
    { httpRoute: '/status', route: '/routes/api/status/status.route', handler: 'get', method: 'GET', protected: false },
    { httpRoute: '/services/backend-uri', route: '/routes/api/services/services.route', handler: 'getBackendUri', method: 'GET', protected: false }
  ],
  file: [
    // Upload files
    { httpRoute: '/upload/single', route: '/routes/api/upload/upload.route', handler: 'upload', method: 'POST', protected: false, isUpload: true },
    { httpRoute: '/upload/bulk', route: '/routes/api/upload/upload.route', handler: 'bulk', method: 'POST', protected: false, isUpload: true }
  ],
  security: [
    // Auth
    { httpRoute: '/login', route: '/routes/api/auth/auth.route', handler: 'login', method: 'POST', protected: false },
    { httpRoute: '/logout', route: '/routes/api/auth/auth.route', handler: 'logout', method: 'POST', protected: false },
    { httpRoute: '/validate-email/', route: '/routes/api/auth/auth.route', handler: 'validateEmail', method: 'POST', protected: false },
    { httpRoute: '/validate-account-chatbot', route: '/routes/api/auth/auth.route', handler: 'validateAccountChatbot', method: 'POST', protected: false }
  ],
  communication: [
    // Notification
    { httpRoute: '/notification/', route: '/routes/api/notification/notification.route', handler: 'get', method: 'GET', protected: false },
    { httpRoute: '/notification/', route: '/routes/api/notification/notification.route', handler: 'create', method: 'POST', protected: false },
    { httpRoute: '/notification/', route: '/routes/api/notification/notification.route', handler: 'update', method: 'PATCH', protected: false }
  ],
  identity: [
    // Device
    { httpRoute: '/device/', route: '/routes/api/device/device.route', handler: 'get', method: 'GET', protected: false },
    { httpRoute: '/device/', route: '/routes/api/device/device.route', handler: 'create', method: 'POST', protected: false },
    { httpRoute: '/device/', route: '/routes/api/device/device.route', handler: 'update', method: 'PATCH', protected: false },
    // User
    { httpRoute: '/user/', route: '/routes/api/user/user.route', handler: 'get', method: 'GET', protected: false },
    { httpRoute: '/user/', route: '/routes/api/user/user.route', handler: 'create', method: 'POST', protected: false },
    { httpRoute: '/user/', route: '/routes/api/user/user.route', handler: 'update', method: 'PATCH', protected: false }
  ]
}

module.exports = router
