// routes/api/communication/communication.routes.js
module.exports = {
  communication: [
    // Notification
    {
      httpRoute: '/notification/:queryselector',
      route: '/routes/api/communication/notification/notification.route',
      handler: 'get',
      method: 'GET',
      protected: false,
    },
    {
      httpRoute: '/notification/',
      route: '/routes/api/communication/notification/notification.route',
      handler: 'create',
      method: 'POST',
      protected: false,
    },
    {
      httpRoute: '/notification/',
      route: '/routes/api/communication/notification/notification.route',
      handler: 'update',
      method: 'PATCH',
      protected: false,
    },
  ],
  file: [
    // Upload files
    {
      httpRoute: '/upload/single',
      route: '/routes/api/communication/upload/upload.route',
      handler: 'uploadFile',
      method: 'POST',
      protected: false,
      supportFile: true,
    },
    {
      httpRoute: '/upload/bulk',
      route: '/routes/api/communication/upload/upload.route',
      handler: 'bulk',
      method: 'POST',
      protected: false,
      supportFile: true,
    },
  ],
}