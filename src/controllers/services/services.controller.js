function servicesController (dependencies) {
  const _utilities = dependencies.utilities
  const _config = dependencies.config

  const getBackendUri = async (data) => {
    return _utilities.response.success(_config.BACKEND_URI || '/')
  }

  return {
    getBackendUri
  }
}

module.exports = servicesController
