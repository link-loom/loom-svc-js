// routes/api/communication/communication.routes.js
module.exports = {
  identity: [
    // Device
    {
      httpRoute: '/device/:queryselector',
      route: '/routes/api/identity/device/device.route',
      handler: 'get',
      method: 'GET',
      protected: false,
    },
    {
      httpRoute: '/device/',
      route: '/routes/api/identity/device/device.route',
      handler: 'create',
      method: 'POST',
      protected: false,
    },
    {
      httpRoute: '/device/',
      route: '/routes/api/identity/device/device.route',
      handler: 'update',
      method: 'PATCH',
      protected: false,
    },
    // User
    {
      httpRoute: '/user/:queryselector',
      route: '/routes/api/identity/user/user.route',
      handler: 'get',
      method: 'GET',
      protected: false,
    },
    {
      httpRoute: '/user/',
      route: '/routes/api/identity/user/user.route',
      handler: 'create',
      method: 'POST',
      protected: false,
    },
    {
      httpRoute: '/user/',
      route: '/routes/api/identity/user/user.route',
      handler: 'update',
      method: 'PATCH',
      protected: false,
    },
  ],
}