// Mounted by the namespace prefix: /billing/invoice/...; every route requires the `default` handler.
module.exports = {
  invoice: [
    {
      httpRoute: '/:queryselector',
      route: '/routes/api/invoice/invoice.route',
      handler: 'get',
      method: 'GET',
      auth: 'default',
    },
    {
      httpRoute: '/',
      route: '/routes/api/invoice/invoice.route',
      handler: 'create',
      method: 'POST',
      auth: 'default',
    },
  ],
};
