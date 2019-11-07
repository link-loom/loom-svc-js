function spaces (dependencies) {
  const _console = dependencies.console
  let _credentials = ''

  const setSettings = (credentials) => {
    setCredentials(credentials)
    _console.success('Spaces manager imported')
  }

  const getCredentials = () => {
    return _credentials
  }

  const setCredentials = (credentials) => {
    _credentials = credentials
  }

  return {
    setSettings,
    getCredentials
  }
}

module.exports = spaces
