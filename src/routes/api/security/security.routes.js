// routes/api/communication/communication.routes.js
module.exports = {
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
}