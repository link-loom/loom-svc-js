class FirebaseStorageSource {
  constructor (dependencies) {
    if (!dependencies) {
      throw new Error('Required args to build this entity');
    }
    /* Base Properties */
    this._dependencies = dependencies;
    this._console = this._dependencies.console;
    this._utilities = this._dependencies.utilities;

    /* Custom Properties */
    this._storage = {};
    this._storageMiddleware = {};
    this._StoreSourceConfig =
      this._dependencies?.config?.modules?.storage?.firebase?.settings || {};
    this._AdminFirestoreConfig =
      this._dependencies?.config?.modules?.database?.firestore?.settings || {};

  }

  async setup () {
    // configurate and initialize firebase admin

    this._dependencies.storage.driver.initializeApp({
      credential: this._dependencies.storage.driver.credential.cert(
        this._AdminFirestoreConfig,
      ),
      storageBucket: this._StoreSourceConfig?.storageBucket,
    });
    this._storage = this._dependencies.storage.driver.storage();
  }

  async upload (clientFile, folder, settings = {}) {
    const { action = 'read', expires = this.#getDatePlus50Years() } = settings;

    try {
      const bucketName = this._StoreSourceConfig?.storageBucket;
      const bucket = this._storage.bucket(bucketName);
      const bucketFile = bucket.file(`${folder}/${clientFile.originalname}`);
      const uploadParams = this.#getUploadParams(clientFile);

      await bucketFile.save(clientFile.buffer, uploadParams);
      const url = await bucketFile.getSignedUrl({
        action,
        expires,
      });

      if (!url || !url.length) {
        return this._utilities.io.response.error(
          'Something was wrong uploading the file',
        );
      }

      return this._utilities.io.response.success({
        url: url[0],
        filename: clientFile.originalname,
        path: folder,
      });
    } catch (error) {
      this._console.error(error);

      return null;
    }
  }

  #getUploadParams = (clientFile) => {
    return {
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip: true,
      // By setting the option `destination`, you can change the name of the
      // object you are uploading to a bucket.
      metadata: {
        // Enable long-lived HTTP caching headers
        // Use only if the contents of the file will never change
        // (If the contents will change, use cacheControl: 'no-cache')
        cacheControl: 'public, max-age=31536000',
      },
      contentType: clientFile.mimetype,
    };
  };

  #getDatePlus50Years () {
    // Get the current date
    const currentDate = new Date();

    // Add 50 years to the current date
    currentDate.setFullYear(currentDate.getFullYear() + 50);

    // Extract day, month, and year
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so we add 1
    const year = currentDate.getFullYear();

    // Return in 'dd-mm-yyyy' format
    return `${month}-${day}-${year}`;
  }
}

module.exports = FirebaseStorageSource;
