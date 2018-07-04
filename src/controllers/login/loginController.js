function loginController (dependencies) {
  const _console = dependencies.console
  const _utilities = dependencies.utilities
  const _auth = dependencies.auth

  const _userController = require(`${dependencies.root}/src/controllers/user/userController`)(dependencies)

  const logout = async () => {
    let token = await _auth.token.destroy()
    return _utilities.response.success(token)
  }

  const login = async (data) => {
    try {
      if (data && data.username && data.password) {
        const userResult = await _userController.getByUsername(data)

        if (_utilities.response.isValid(userResult)) {
          const user = _utilities.response.clean(userResult.result)
          let token = await _auth.token.create(user)

          return _utilities.response.success(token)
        } else {
          return _utilities.response.error('User not found')
        }
      } else {
        return _utilities.response.error('Data provided not match with any registered user')
      }
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
