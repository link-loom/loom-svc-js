function Storage (dependencies) {
  const _spacesManager = require(`${dependencies.root}/src/core/spaces.manager`)(dependencies)

  /// Dependencies
  const _console = dependencies.console
  const _aws = dependencies.aws

  /// Properties
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

    dependencies.storage = _storage || {}
    _console.success('Storage imported')
  }

  const spacesConfig = async () => {
    _aws.config.update({
      accessKeyId: _spacesManager.getCredentials().accessKeyId,
      secretAccessKey: _spacesManager.getCredentials().secretAccessKey
    })
    const spacesEndpoint = new _aws.Endpoint(_spacesManager.getCredentials().endpoint)

    _storage = new _aws.S3({
      endpoint: spacesEndpoint
    })
  }

  return {
    initialize: constructor
  }
}

module.exports = Storage
