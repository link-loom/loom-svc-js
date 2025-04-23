const { BlobServiceClient } = require('@azure/storage-blob');

class AzureStorageSource {
  constructor(dependencies) {
    if (!dependencies) {
      throw new Error('Required args to build this entity');
    }

    /* Base Properties */
    this._dependencies = dependencies;
    this._console = this._dependencies.console;
    this._utilities = this._dependencies.utilities;

    /* Custom Properties */
    this._module = this._dependencies.modules?.storage?.azurestorage || {};
    this._driver = null;
    this._settings = null;
  }

  async setup({ settings: adapter }) {
    try {
      if (!adapter) {
        throw new Error('Azure Blob Storage configuration missing');
      }

      const { settings } = adapter;

      this._settings = settings || {};

      this._driver = BlobServiceClient.fromConnectionString(adapter.connection);

      this._console.success('Client initialized', { namespace: this._namespace });

      return this._driver;
    } catch (error) {
      this._console.error('Error setting up Module', { namespace: this._namespace });
      console.error(error);
    }
  }

  async upload({ clientFile, folder }) {
    try {
      if (!this._driver) {
        throw new Error('Storage not initialized. Call setup() first.');
      }

      const containerClient = this._driver.getContainerClient(this._settings.containerName);

      const createContainerResponse = await containerClient.createIfNotExists({ access: 'container' });

      if (createContainerResponse.succeeded) {
        this._console.log(`Container '${this._settings.containerName}' created successfully.`);
      }

      const blobName = `${folder}/${clientFile.originalname}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      const uploadParams = this.#getUploadParams(clientFile);

      await blockBlobClient.uploadData(clientFile.buffer, uploadParams);

      const blobUrl = blockBlobClient.url;

      return this._utilities.io.response.success({
        url: blobUrl,
        filename: clientFile.originalname,
        path: folder,
      });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error('Error uploading the file');
    }
  }

  #getUploadParams = (clientFile) => {
    return {
      blobHTTPHeaders: {
        blobContentType: clientFile.mimetype,
        blobCacheControl: `public, max-age=${this.#getMaxAgeInSeconds(1)}`,
      },
    };
  };

  #getMaxAgeInSeconds(years) {
    return years * 365 * 24 * 60 * 60;
  }
}

module.exports = AzureStorageSource;
