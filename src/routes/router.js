const systemRoutes = require('./api/system/system.routes');
const communicationRoutes = require('./api/communication/communication.routes');
const identityRoutes = require('./api/identity/identity.routes');
const securityRoutes = require('./api/security/security.routes');

const router = {
  ...systemRoutes,
  ...communicationRoutes,
  ...identityRoutes,
  ...securityRoutes,
  hello: [
    { method: 'GET',  httpRoute: '/ping',   route: 'routes/api/hello/hello.route', handler: 'ping',   protected: false },
    { method: 'GET',  httpRoute: '/status', route: 'routes/api/hello/hello.route', handler: 'status', protected: false },
    { method: 'POST', httpRoute: '/echo',   route: 'routes/api/hello/hello.route', handler: 'echo',   protected: false },
    { method: 'POST', httpRoute: '/write',  route: 'routes/api/hello/hello.route', handler: 'write',  protected: false },
    { method: 'GET',  httpRoute: '/read',   route: 'routes/api/hello/hello.route', handler: 'read',   protected: false },
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
