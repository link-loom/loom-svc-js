function Storage (dependencies) {
  const _spacesManager = require(`${dependencies.root}/src/core/spaces.manager`)(dependencies)

  /// Dependencies
  const _console = dependencies.console
  const _aws = dependencies.aws
  const _multer = dependencies.multerModule
  const _multerS3 = dependencies.multerS3

  /// Properties
  let _cdnStorage = {}
  let _storage = {}

  const constructor = () => {
    return storageConnect()
  }

  const storageConnect = async () => {
    if (!dependencies.config.USE_STORAGE) {
      _console.info('Storage is not configured')
      return
    }

    switch (dependencies.config.STORAGE_NAME) {
      case 'spaces':
        _spacesManager.setSettings(dependencies.config.DIGITALOCEAN.SPACES)
        dependencies.settings.dependencies().add(_spacesManager, 'spacesManager')
        await spacesConfig()
        break
      default:
        break
    }

    await storageConfig()

    dependencies.cdnStorage = _cdnStorage || {}
    dependencies.storage = _storage || {}
    _console.success('Storage imported')
  }

  const storageConfig = async () => {
    _storage = _multer({
      limits: {
        fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
      },
      storage: _multer.memoryStorage()
    })
  }

  const spacesConfig = async () => {
    _aws.config.update({
      accessKeyId: _spacesManager.getCredentials().accessKeyId,
      secretAccessKey: _spacesManager.getCredentials().secretAccessKey
    })
    const spacesEndpoint = new _aws.Endpoint(_spacesManager.getCredentials().endpoint)

    const s3 = new _aws.S3({
      endpoint: spacesEndpoint
    })

    _cdnStorage = _multer({
      limits: {
        fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
      },
      storage: _multerS3({
        s3,
        bucket: _spacesManager.getCredentials().bucket,
        acl: 'public-read',
        key: (request, file, cb) => {
          _console.log(`Uploading file: ${file}`)
          cb(null, file.originalname)
        }
      })
    })
  }

  return {
    initialize: constructor
  }
}

module.exports = Storage
