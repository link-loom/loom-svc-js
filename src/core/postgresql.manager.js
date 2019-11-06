function postgresql (dependencies) {
  let _credentials = ''

  const setSettings = (credentials) => {
    setCredentials(credentials)
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

module.exports = postgresql
