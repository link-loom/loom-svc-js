const systemRoutes = require('./api/system/system.routes');
const communicationRoutes = require('./api/communication/communication.routes');
const identityRoutes = require('./api/identity/identity.routes');
const securityRoutes = require('./api/security/security.routes');

const router = {
  ...systemRoutes,
  ...communicationRoutes,
  ...identityRoutes,
  ...securityRoutes,
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
