// Mounted by the namespace prefix: GET /catalog/product/:queryselector, POST /catalog/product/
module.exports = {
  product: [
    {
      httpRoute: '/:queryselector',
      route: '/routes/api/product/product.route',
      handler: 'get',
      method: 'GET',
      auth: 'public',
    },
    {
      httpRoute: '/',
      route: '/routes/api/product/product.route',
      handler: 'create',
      method: 'POST',
      auth: 'default',
    },
  ],
};
