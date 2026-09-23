// Functions of the billing namespace: they receive the namespace's dependencies.
const definition = {
  cache: [],
  timed: [],
  startup: [
    {
      name: 'billingIndexes',
      route: '/functions/startup/indexes/indexes.function',
      executionMode: 'atTime',
    },
  ],
};

module.exports = definition;
