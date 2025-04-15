const DataSource = require('../base/data-source');

class FirestoreDataSource extends DataSource {
  constructor (dependencies) {
    if (!dependencies) {
      throw new Error('Required args to build this entity');
    }

    super(dependencies);

    /* Base Properties */
    this._dependencies = dependencies;
    this._console = this._dependencies.console;
    this._utilities = this._dependencies.utilities;
    this._database = this._dependencies?.database?.default?.client;

    /* Custom Properties */
    this._dataSourceConfig =
      this._dependencies?.config?.modules?.database?.providers?.firestore || {};
    this._databaseConnectionObj = this._dataSourceConfig?.settings || {};
    this._databaseSettings = this._dataSourceConfig?.settings || {};
  }

  async setup () {
    // Setup the driver/client
    /* TODO: Setup all configurations of your database provider */

    // Create a client and create a new connection
    this._database.client = {
      /* TODO: Save your client connected here */
    };
  }

  async create ({ tableName, entity } = {}) {
    try {
      const superResponse = await super.create({ tableName, entity });

      if (!this._utilities.validator.response(superResponse)) {
        return superResponse;
      }

      const document = this._database.client.collection(tableName).doc(entity.id);
      const documentResponse = await document.set(entity);

      if (!documentResponse) {
        this._console.error('Empty response');

        return null;
      }

      return entity || {};
    } catch (error) {
      this._console.error(error);

      return null;
    }
  }

  async update ({ tableName, entity }) {
    try {
      const superResponse = await super.update({ tableName, entity });

      if (!this._utilities.validator.response(superResponse)) {
        return superResponse;
      }

      // Getting the original entity
      const entityResponse = await this.getByFilters({
        tableName,
        filters: [
          {
            key: 'id',
            operator: '==',
            value: entity.id,
          },
        ],
      });

      if (!entityResponse || !entityResponse.length) {
        return this._utilities.io.response.error('Item not found');
      }

      const currentEntity = entityResponse[0];

      // "Merging" the new data with the old data
      entity = { ...currentEntity, ...entity };

      const document = this._database.client
        .collection(tableName)
        .doc(currentEntity.id);
      const documentResponse = await document.update(entity);

      if (!documentResponse) {
        this._console.error(documentResponse);

        return null;
      }

      return entity || {};
    } catch (error) {
      this._console.error(error);

      return null;
    }
  }

  async getByFilters ({ tableName, filters }) {
    try {
      const superResponse = await super.getByFilters({ tableName, filters });

      if (!this._utilities.validator.response(superResponse)) {
        return superResponse;
      }

      let collection = this._database.client.collection(tableName);
      collection = this.#transformFilters(collection, filters);

      const snapshot = await collection.get();

      // Cast Firebase object into an arry of devices
      const entityResponse = this.#castArraySnapshot(snapshot);

      return entityResponse.data || [];
    } catch (error) {
      this._console.error(error);

      return [];
    }
  }

  #transformFilters (collection, filters) {
    try {
      for (const filter of filters) {
        if (filter.key) {
          collection = collection.where(
            filter.key || '',
            filter.operator || '==',
            filter.value || '',
          );
        }
      }

      return collection;
    } catch (error) {
      this._console.error(error);
      return collection;
    }
  }

  /**
   * Cast a Firebase snapshot into an array
   * @param {any} snapshot is the snapshop returned by database
   * @returns an array of objects
   */
  #castArraySnapshot (snapshot) {
    if (snapshot) {
      const arr = [];
      const obj = {};

      snapshot.docs.forEach((childSnapshot) => {
        const item = childSnapshot.data();
        arr.push(item);
      });

      obj.raw = snapshot;
      obj.data = arr;

      return obj;
    } else {
      return null;
    }
  }
}

module.exports = FirestoreDataSource;
