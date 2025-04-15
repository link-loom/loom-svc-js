const adapters = [
  {
    name: 'firestore',
    path: 'firestore/firestore-data-source',
    handler: 'FirebaseDataSource',
    customDependencyName: 'firebase',
  },
  {
    name: 'mongodb',
    path: 'mongodb/mongodb-data-source',
    handler: 'MongodbDataSource',
    customDependencyName: 'mongodb',
  },
];

module.exports = adapters;
