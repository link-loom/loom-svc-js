// routes/api/system/system.routes.js
module.exports = {
  system: [
    {
      httpRoute: '/health',
      route: '/routes/api/system/health/health.route',
      handler: 'get',
      method: 'GET',
      protected: false,
    },
    {
      httpRoute: '/api-manager/uri',
      route: '/routes/api/system/api-manager/api-manager.route',
      handler: 'getApiManagerUri',
      method: 'GET',
      protected: false,
    },
  ]
};