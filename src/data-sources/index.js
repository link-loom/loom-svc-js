const dataSources = [
  { name: 'firestore', path: 'firestore/firestore-data-source', handler: 'FirebaseDataSource', customDependencyName: 'firebase' },
  { name: 'postgresql', path: 'postgresql/postgresql-data-source', handler: 'PostgresqlDataSource' },
  { name: 'mongodb', path: 'mongodb/mongodb-data-source', handler: 'MongodbDataSource' },
]

module.exports = dataSources