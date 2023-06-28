class StorageManager {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies
    this._console = dependencies.console

    /* Custom Properties */
    this._aws = dependencies.aws
    this._multer = dependencies.multerModule

    /* Assigments */
    this._namespace = '[Server]::[Storage]::[Manager]'
    this._storage = {}
    this._s3 = {}
    this._stg = {}
  }

  async setup () {
    this._console.success('Loading', { namespace: this._namespace })

    await this.storageConfig()

    this._dependencies.storage = this._storage || {}

    if (!this._dependencies.config.SETTINGS.USE_STORAGE) {
      this._console.info('Manager is disabled', { namespace: this._namespace })
      return
    }

    switch (this._dependencies.config.SETTINGS.STORAGE_NAME) {
      case 'spaces':
        await this.spacesConfig()
        break
      case 'firebase':
        await this.firebaseConfig()
        break
      default:
        break
    }

    this._console.success('Loaded', { namespace: this._namespace })
  }

  async storageConfig () {
    this._storage = this._multer({
      limits: {
        fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
      },
      storage: this._multer.memoryStorage()
    })
  }

  async spacesConfig () {
    try {
      const { SpacesManager } = require(`${this._dependencies.root}/src/core/spaces.manager`)
      this._spacesManager = new SpacesManager(this._dependencies)
      this._spacesManager.setup(this._dependencies.config.DIGITALOCEAN.SPACES)

      const spacesEndpoint = new this._aws.Endpoint(this._spacesManager.getCredentials().endpoint)

      this._dependencies.dependenciesManager.core.add(this._spacesManager, 'spacesManager')
      this._dependencies.s3 = this._s3

      this._s3 = new this._aws.S3({
        endpoint: spacesEndpoint,
        accessKeyId: this._spacesManager.getCredentials().accessKeyId,
        secretAccessKey: this._spacesManager.getCredentials().secretAccessKey
      })
    } catch (error) {
      console.log(error)
    }
  }

  async firebaseConfig () {
    try {
      this._stg = this._dependencies.firebase.storage()
    } catch (error) {
      console.log(error)
    }
  }

  get storage () {
    return this._stg
  }
}

module.exports = { StorageManager }
