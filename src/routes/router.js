const router = {
  system: [
    {
      httpRoute: '/health',
      route: '/routes/api/health/health.route',
      handler: 'get',
      method: 'GET',
      protected: false,
    },
    {
      httpRoute: '/api-manager/uri',
      route: '/routes/api/api-manager/api-manager.route',
      handler: 'getApiManagerUri',
      method: 'GET',
      protected: false,
    },
  ],
  file: [
    // Upload files
    {
      httpRoute: '/upload/single',
      route: '/routes/api/upload/upload.route',
      handler: 'uploadFile',
      method: 'POST',
      protected: false,
      supportFile: true,
    },
    {
      httpRoute: '/upload/bulk',
      route: '/routes/api/upload/upload.route',
      handler: 'bulk',
      method: 'POST',
      protected: false,
      supportFile: true,
    },
  ],
  security: [
    // Auth static password email
    {
      httpRoute: '/signup/email/password',
      route: '/routes/api/security/auth-password/auth-password.route',
      handler: 'signUpPassword',
      method: 'POST',
      protected: false,
    },
    {
      httpRoute: '/signin/email/password',
      route: '/routes/api/security/auth-password/auth-password.route',
      handler: 'signInPassword',
      method: 'POST',
      protected: false,
    },
    {
      httpRoute: '/password/email/reset',
      route: '/routes/api/security/auth-password/auth-password.route',
      handler: 'resetPassword',
      method: 'POST',
      protected: false,
    },
    {
      httpRoute: '/password/email/new',
      route: '/routes/api/security/auth-password/auth-password.route',
      handler: 'newPassword',
      method: 'PATCH',
      protected: false,
    },
  ],
  communication: [
    // Notification
    {
      httpRoute: '/notification/:queryselector',
      route: '/routes/api/notification/notification.route',
      handler: 'get',
      method: 'GET',
      protected: false,
    },
    {
      httpRoute: '/notification/',
      route: '/routes/api/notification/notification.route',
      handler: 'create',
      method: 'POST',
      protected: false,
    },
    {
      httpRoute: '/notification/',
      route: '/routes/api/notification/notification.route',
      handler: 'update',
      method: 'PATCH',
      protected: false,
    },
  ],
  identity: [
    // Device
    {
      httpRoute: '/device/:queryselector',
      route: '/routes/api/device/device.route',
      handler: 'get',
      method: 'GET',
      protected: false,
    },
    {
      httpRoute: '/device/',
      route: '/routes/api/device/device.route',
      handler: 'create',
      method: 'POST',
      protected: false,
    },
    {
      httpRoute: '/device/',
      route: '/routes/api/device/device.route',
      handler: 'update',
      method: 'PATCH',
      protected: false,
    },
    // User
    {
      httpRoute: '/user/:queryselector',
      route: '/routes/api/user/user.route',
      handler: 'get',
      method: 'GET',
      protected: false,
    },
    {
      httpRoute: '/user/',
      route: '/routes/api/user/user.route',
      handler: 'create',
      method: 'POST',
      protected: false,
    },
    {
      httpRoute: '/user/',
      route: '/routes/api/user/user.route',
      handler: 'update',
      method: 'PATCH',
      protected: false,
    },
  ],
  example: [
    // Template
    {
      httpRoute: '/template/:queryselector',
      route: '/routes/api/_template/_template.route',
      handler: 'get',
      method: 'GET',
      protected: false,
    },
    {
      httpRoute: '/template/',
      route: '/routes/api/_template/_template.route',
      handler: 'create',
      method: 'POST',
      protected: false,
    },
    {
      httpRoute: '/template/',
      route: '/routes/api/_template/_template.route',
      handler: 'update',
      method: 'PATCH',
      protected: false,
    },
    {
      httpRoute: '/template/',
      route: '/routes/api/_template/_template.route',
      handler: 'delete',
      method: 'DELETE',
      protected: false,
    },
  ],
};

module.exports = router;
