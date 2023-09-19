const DataSource = require('./../base/data-source');

class MongoDBDataSource extends DataSource {
  constructor(dependencies) {
    if (!dependencies) {
      throw new Error('Required args to build this entity');
    }

    super(dependencies);

    /* Base Properties */
    this._dependencies = dependencies;
    this._console = this._dependencies.console;
    this._utilities = this._dependencies.utilities;
    this._db = this._dependencies.db;

    /* Custom Properties */
    this._dataSourceConfig =
      this._dependencies.config.DATASOURCE_CONFIGS.MONGODB;
    this._databaseConnectionObj = this._dataSourceConfig.CONNECTION_OBJ || {};
    this._databaseSettings = this._dataSourceConfig.SETTINGS || {};
  }

  async setup() {
    try {
      // Setup the driver/client
      const settings = this._databaseSettings;
      settings.serverApi = this._db.driver.ServerApiVersion.v1;

      // Create a client and create a new connection
      this.mongoClient = new this._db.driver.MongoClient(
        this._databaseConnectionObj,
        settings,
      );
      this._db.client = await this.mongoClient.connect();
    } catch (error) {
      this._console.error(error);
    }
  }

  async create({ tableName, entity } = {}) {
    try {
      const superResponse = await super.create({ tableName, entity });

      if (!this._utilities.validator.response(superResponse)) {
        return superResponse;
      }

      const collection = this._db.client
        .db(this._databaseSettings.dbName)
        .collection(tableName);
      const documentResponse = collection.insertOne(entity);

      if (!documentResponse) {
        this._utilities.io.response.error();
      }

      return documentResponse || {};
    } catch (error) {
      this._console.error(error);

      return null;
    }
  }

  async update({ tableName, entity } = {}) {
    try {
      const superResponse = await super.update({ tableName, entity });

      if (!this._utilities.validator.response(superResponse)) {
        return superResponse;
      }

      const query = { id: entity.id };
      const contract = { $set: entity };
      const collection = this._db.client
        .db(this._databaseSettings.dbName)
        .collection(tableName);

      const documentResponse = await collection.updateOne(query, contract);

      return documentResponse || {};
    } catch (error) {
      this._console.error(error);

      return null;
    }
  }

  /**
   * Retrieve entities by applying given filters.
   *
   * This method queries the specified MongoDB collection based on given filters
   * and provides both the matched data and the count of matched and total records.
   * It makes use of the aggregation pipeline to achieve this.
   *
   * The `facet` operation in the pipeline allows us to process multiple aggregation
   * operations within a single stage and outputs the results in an array for each operation.
   * Specifically:
   * - 'data' contains the documents that match the transformed filters.
   * - 'matchCount' provides the count of the documents matching the filters.
   * - 'totalCount' provides the count of all documents in the collection.
   *
   * The `project` operation reshapes the output, making it more suitable for further processing
   * or final output. Here, it's used to extract values from the arrays produced by the `facet` operation.
   *
   * @param {object} params - The parameters for getting by filters.
   * @param {string} params.tableName - The name of the MongoDB collection.
   * @param {Array<object>} params.filters - An array of filter objects.
   *
   * @returns {Array<object>} The array of found entities or an empty array if none found.
   *                          The returned object includes 'data', 'matchCount', and 'totalCount' fields.
   */
  async getByFilters({ tableName, filters }) {
    try {
      const superResponse = await super.getByFilters({ tableName, filters });

      if (!this._utilities.validator.response(superResponse)) {
        return superResponse;
      }

      const transformedFilters = this.#transformFilters(filters);
      const pagination = this.#extractPagination(filters);
      const collection = this._db.client
        .db(this._databaseSettings.dbName)
        .collection(tableName);
      const dataPipeline = [{ $match: transformedFilters }];
      const matchCountIndex = 0;
      const totalCountIndex = 0;
      const aggregatedDefaultIndex = 0;
      let entityResponse = {};

      if (pagination.skip !== null) {
        dataPipeline.push({ $skip: pagination.skip });
      }

      if (pagination.limit !== null) {
        dataPipeline.push({ $limit: pagination.limit });
      }

      const results = await collection
        .aggregate([
          {
            $facet: {
              matchedItems: dataPipeline,
              matchCount: [...dataPipeline, { $count: 'total' }],
              totalCount: [{ $count: 'total' }],
            },
          },
          {
            $project: {
              matchedItems: '$matchedItems',
              filteredCount: {
                $arrayElemAt: ['$matchCount.total', matchCountIndex],
              },
              totalItems: {
                $arrayElemAt: ['$totalCount.total', totalCountIndex],
              },
            },
          },
        ])
        .toArray();

      entityResponse =
        !results || !results.length ? null : results[aggregatedDefaultIndex];

      return entityResponse;
    } catch (error) {
      this._console.error(error);

      return [];
    }
  }

  /**
   * Transform a single filter into its MongoDB counterpart.
   *
   * @param {object} filter - The filter object to transform.
   * @returns {object} The MongoDB filter object.
   */
  #transformSingleFilter(filter) {
    if (!filter.key) return {};

    const valueToArray = (value) => {
      if (typeof value === 'string') {
        return value.split(',');
      } else if (Array.isArray(value)) {
        return value;
      } else {
        return [];
      }
    };

    switch (filter.operator) {
      case '==':
        return { [filter.key]: filter.value };
      case '!==':
        return { [filter.key]: { $ne: filter.value } };
      case 'in':
        return { [filter.key]: { $in: valueToArray(filter.value) } };
      case 'not-in':
        return { [filter.key]: { $nin: valueToArray(filter.value) } };
      default:
        return { [filter.key]: filter.value };
    }
  }

  /**
   * Transform an array of filters into a MongoDB filter query.
   *
   * @param {Array<object>} filters - An array of filter objects to transform.
   * @returns {object} The MongoDB filter query.
   * @throws Will throw an error if a single filter transformation fails.
   */
  #transformFilters(filters) {
    try {
      const transformedFilters = { $and: [] };

      filters.forEach((filter) => {
        if (!filter.value) return;

        if (filter.key !== 'skip' && filter.key !== 'limit') {
          transformedFilters.$and.push(this.#transformSingleFilter(filter));
        }
      });

      return transformedFilters.$and.length ? transformedFilters : {};
    } catch (error) {
      this._console.error('Error transforming filter: ', error);
      return {};
    }
  }

  /**
   * Extract pagination data from the given filter array.
   *
   * @param {Array<object>} filters - An array of filter objects.
   * @returns {object} An object containing the 'skip' and 'limit' pagination values.
   */
  #extractPagination(filters) {
    const pagination = {
      skip: null,
      limit: null,
    };

    for (const filter of filters) {
      const { key, value } = filter;
      let convertedValue = Number(value);

      if (typeof value === 'number' && value >= 0 && !isNaN(convertedValue)) {
        if (['skip', 'limit'].includes(key)) {
          pagination[key] = value;
        }
      }
    }

    return pagination;
  }
}

module.exports = MongoDBDataSource;
