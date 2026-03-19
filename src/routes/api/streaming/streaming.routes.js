module.exports = {
  streaming: [
    {
      method: 'GET',
      httpRoute: '/tick',
      route: 'routes/api/streaming/streaming.route',
      handler: 'tick',
      protected: false,
      streaming: true,
    },
    {
      method: 'GET',
      httpRoute: '/heartbeat',
      route: 'routes/api/streaming/streaming.route',
      handler: 'heartbeat',
      protected: false,
      streaming: true,
    },
  ],
};
