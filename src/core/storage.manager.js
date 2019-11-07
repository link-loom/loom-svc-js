function Storage (dependencies) {
  const _spacesManager = require(`${dependencies.root}/src/core/spaces.manager`)(dependencies)

  /// Dependencies
  const _console = dependencies.console
  const _aws = dependencies.aws
  const _multer = dependencies.multerModule

  /// Properties
  let _storage = {}
  let _s3 = {}

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

    dependencies.storage = _storage || {}
    dependencies.s3 = _s3
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
    const spacesEndpoint = new _aws.Endpoint(_spacesManager.getCredentials().endpoint)
    _s3 = new _aws.S3({
      endpoint: spacesEndpoint,
      accessKeyId: _spacesManager.getCredentials().accessKeyId,
      secretAccessKey: _spacesManager.getCredentials().secretAccessKey
    })
  }

  return {
    initialize: constructor
  }
}

module.exports = Storage
