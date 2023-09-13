const DataSource = require('./../base/data-source')

class FirebaseStorageSource extends DataSource {
  constructor (dependencies) {
    if (!dependencies) {
      throw new Error('Required args to build this entity')
    }

    super(dependencies)

    /* Base Properties */
    this._dependencies = dependencies
    this._console = this._dependencies.console
    this._utilities = this._dependencies.utilities

    /* Custom Properties */
    this._storage = {}
    this._storageMiddleware = {}
    this._StoreSourceConfig = this._dependencies.config.STORAGESOURCE_CONFIG.FIRESTORE
    this._AdminFirestore = this._dependencies.config.DATASOURCE_CONFIGS.FIRESTORE.CONNECTION_OBJ
    this._StorageConnectionObj = this._StoreSourceConfig.CONNECTION_OBJ || {}
    this._databaseSettings = this._StoreSourceConfig.SETTINGS || {}
  }

  async setup () {
    // Setup the driver/client
    // configurate and initialize firebase admin

    this._dependencies.storage.firebase.initializeApp({
      credential: this._dependencies.storage.firebase.credential.cert(this._AdminFirestore),
      storageBucket: this._StorageConnectionObj.storageBucket
    })

    this._storage = this._dependencies.storage.firebase.storage()
  }

  async upload (clientFile, folder) {
    try {
      const bucketName = this._StorageConnectionObj.storageBucket
      const bucket = this._storage.bucket(bucketName)
      const bucketFile = bucket.file(`${folder}/${clientFile.originalname}`)
      const uploadParams = this.#getUploadParams(clientFile)

      await bucketFile.save(clientFile.buffer, uploadParams)
      const url = await bucketFile.getSignedUrl({
        action: 'read',
        expires: '01-01-2050'
      })

      if (!url || !url.length) {
        return this._utilities.io.response.error('Something was wrong uploading the file')
      }

      return this._utilities.io.response.success({ url: url[0], filename: clientFile.originalname, path: folder })
    } catch (error) {
      this._console.error(error)

      return null
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
        cacheControl: 'public, max-age=31536000'
      },
      contentType: clientFile.mimetype
    }
  }
}

module.exports = FirebaseStorageSource
