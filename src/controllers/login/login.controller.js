function loginController (dependencies) {
  const _console = dependencies.console
  const _utilities = dependencies.utilities
  const _auth = dependencies.auth
  const _controllers = dependencies.controllers

  const logout = async () => {
    let token = await _auth.token.destroy()
    return _utilities.response.success(token)
  }

  const login = async (data) => {
    try {
      if (!data || !data.username || !data.password) {
        return _utilities.response.error('Data provided not match with any registered user')
      }

      const userResult = await _controllers.user.getByUsername(data)

      if (!_utilities.response.isValid(userResult)) {
        return _utilities.response.error('User not found')
      }

      const user = _utilities.response.clean(userResult.result)
      const token = await _auth.token.create(user)

      return _utilities.response.success(token)
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  return {
    user: login,
    logout
  }
}

module.exports = loginController
