const DataSource = require('../base/data-source');
const { MongoClient, ServerApiVersion } = require("mongodb");

class MongoDBDataSource extends DataSource {
  constructor (dependencies) {
    if (!dependencies) {
      throw new Error('Required args to build this entity');
    }

    super(dependencies);

    /* Base Properties */
    this._dependencies = dependencies;
    this._console = this._dependencies.console;
    this._utilities = this._dependencies.utilities;

    /* Custom Properties */
    this._module = this._dependencies.modules?.database?.mongodb || {};
    this._driver = null;
    this._settings = null;
    this._namespace = '[Loom]::[Database]::[MongoDB]';
  }

  async setup({ adapter }) {
    try {
      if (!adapter) {
        throw new Error('MongoDB configuration missing');
      }

      const { settings } = adapter;

      this._settings = settings || {};

      const { connection, ...options } = this._settings;

      this._driver = new MongoClient(connection, {
        ...options,
        serverApi: ServerApiVersion.v1,
      });

      await this._driver.connect();

      this._console.success('Client initialized', { namespace: this._namespace });

      return this._driver;
    } catch (error) {
      this._console.error('Error setting up Module', { namespace: this._namespace });
      console.error(error);
    }
  }

  async create ({ tableName, entity, databaseName = '' } = {}) {
    try {
      const superResponse = await super.create({ tableName, entity });

      if (!this._utilities.validator.response(superResponse)) {
        return superResponse;
      }

      const collection = this._driver.db(databaseName || this._settings.dbName).collection(tableName);
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

  async update ({ tableName, entity, databaseName = '' } = {}) {
    try {
      const superResponse = await super.update({ tableName, entity });

      if (!this._utilities.validator.response(superResponse)) {
        return superResponse;
      }

      const query = { id: entity.id };
      const { _id, ...updateFields } = entity;
      const contract = { $set: updateFields };
      const collection = this._driver.db(databaseName || this._settings.dbName).collection(tableName);

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
  async getByFilters ({ tableName, filters, page = 1, pageSize = 25, relationships = [], databaseName = '' }) {
    try {
      const superResponse = await super.getByFilters({ tableName, filters });

      if (!this._utilities.validator.response(superResponse)) {
        return superResponse;
      }

      const transformedFilters = this.#transformFilters(filters);
      const collection = this._driver.db(databaseName || this._settings.dbName).collection(tableName);

      const skip = (page - 1) * pageSize;

      const pipeline = [{ $match: transformedFilters }];

      relationships.forEach((relation) => {
        pipeline.push({
          $lookup: {
            from: relation.fromCollection,
            localField: relation.localKey,
            foreignField: relation.foreignKey,
            as: relation.as,
          },
        });

        if (relation.unwind) {
          pipeline.push({ $unwind: `$${relation.as}` });
        }
      });

      pipeline.push(
        {
          $facet: {
            items: [{ $skip: skip }, { $limit: pageSize }],
            totalItems: [{ $count: 'total' }],
          },
        },
        {
          $project: {
            items: 1,
            totalItems: {
              $cond: {
                if: { $gt: [{ $size: '$totalItems' }, 0] },
                then: { $arrayElemAt: ['$totalItems.total', 0] },
                else: 0,
              },
            },
            totalPages: {
              $cond: {
                if: { $gt: [{ $size: '$totalItems' }, 0] },
                then: { $ceil: { $divide: [{ $arrayElemAt: ['$totalItems.total', 0] }, pageSize] } },
                else: 1,
              },
            },
          },
        }
      );

      const results = await collection.aggregate(pipeline).toArray();
      const entityResponse = results && results.length > 0 ? results[0] : { items: [], totalItems: 0, totalPages: 1 };

      entityResponse.currentPage = page;
      entityResponse.pageSize = pageSize;

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
  #transformSingleFilter (filter) {
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
      case '>=':
        return { [filter.key]: { $gte: filter.value } };
      case '<=':
        return { [filter.key]: { $lte: filter.value } };
      case '>':
        return { [filter.key]: { $gt: filter.value } };
      case '<':
        return { [filter.key]: { $lt: filter.value } };
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
  #transformFilters (filters) {
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
   * Perform a text search in the specified MongoDB collection with pagination.
   *
   * This method queries the specified MongoDB collection using a text search
   * on the 'query' field. If pagination is provided, it applies the pagination settings.
   *
   * @param {object} params - The parameters for the text search.
   * @param {string} params.tableName - The name of the MongoDB collection.
   * @param {string} params.query - The text to search for.
   * @param {number} params.page - The page number for pagination (optional).
   * @param {number} params.pageSize - The number of items per page for pagination (optional).
   *
   * @returns {object} The array of found entities or an empty array if none found.
   *                   The returned object includes 'items', 'totalItems', 'totalPages', and 'currentPage' fields.
   */
  async getBySearchQuery ({ tableName, query, page = 1, pageSize = 25, databaseName = '' }) {
    try {
      const collection = this._driver.db(databaseName || this._settings.dbName).collection(tableName);

      const skip = (page - 1) * pageSize;

      // Perform the search query with pagination
      const pipeline = [
        { $match: query },
        {
          $facet: {
            items: [{ $skip: skip }, { $limit: pageSize }],
            totalItems: [{ $count: 'total' }],
          },
        },
        {
          $project: {
            items: 1,
            totalItems: {
              $cond: {
                if: { $gt: [{ $size: '$totalItems' }, 0] },
                then: { $arrayElemAt: ['$totalItems.total', 0] },
                else: 0,
              },
            },
            totalPages: {
              $cond: {
                if: { $gt: [{ $size: '$totalItems' }, 0] },
                then: { $ceil: { $divide: [{ $arrayElemAt: ['$totalItems.total', 0] }, pageSize] } },
                else: 1,
              },
            },
          },
        },
      ];

      const results = await collection.aggregate(pipeline).toArray();
      const entityResponse = results && results.length > 0 ? results[0] : { items: [], totalItems: 0, totalPages: 1 };

      entityResponse.currentPage = page;
      entityResponse.pageSize = pageSize;

      return entityResponse;
    } catch (error) {
      this._console.error(error);
      return [];
    }
  }
}

module.exports = MongoDBDataSource;
