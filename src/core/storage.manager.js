class StorageManager {
  constructor (dependencies) {
    const { SpacesManager } = require(`${dependencies.root}/src/core/spaces.manager`)

    this._dependencies = dependencies
    this._console = dependencies.console
    this._aws = dependencies.aws
    this._multer = dependencies.multerModule
    this._spacesManager = new SpacesManager(dependencies)
    this._storage = {}
    this._s3 = {}
  }

  async loadStorage () {
    if (!this._dependencies.config.USE_STORAGE) {
      this._console.info('Storage is not configured')
      return
    }

    switch (this._dependencies.config.STORAGE_NAME) {
      case 'spaces':
        this._spacesManager.setSettings(this._dependencies.config.DIGITALOCEAN.SPACES)
        this._dependencies.settings.dependencies.core.add(this._spacesManager, 'spacesManager')
        await this.spacesConfig()
        break
      default:
        break
    }

    await this.storageConfig()

    this._dependencies.storage = this._storage || {}
    this._dependencies.s3 = this._s3
    this._console.success('Storage manager loaded')
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
      const spacesEndpoint = new this._aws.Endpoint(this._spacesManager.getCredentials().endpoint)
      this._s3 = new this._aws.S3({
        endpoint: spacesEndpoint,
        accessKeyId: this._spacesManager.getCredentials().accessKeyId,
        secretAccessKey: this._spacesManager.getCredentials().secretAccessKey
      })
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = { StorageManager }
