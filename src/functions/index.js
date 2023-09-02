const definition = {
  cache: [
    {
      name: 'cacheTemplate',
      route: '/functions/cache/_template/_template.function',
      storage: 'RAM',
      expire: 'never',
    },
  ],
  timed: [
    {
      name: 'timedTemplate',
      route: '/functions/timed/_template/_template.function',
      startAt: '23:59:59',
      intervalTime: '24',
      intervalMeasure: 'hours',
    },
  ],
  startup: [
    {
      name: 'startupTemplate',
      route: '/functions/startup/_template/_template.function',
      executionType: 'onServerLoaded',
    },
  ],
};

module.exports = definition;
