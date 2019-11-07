function authRoute (dependencies) {
  const _utilities = dependencies.utilities
  const _controllers = dependencies.controllers

  /**
     * Login user
     *
     * route to show message (POST http://<<URL>>/api/login/:id)
     */
  const login = async (req, res) => {
    const params = _utilities.request.getParameters(req)
    const result = await _controllers.auth.login(params)

    res.json(result)
  }

  const logout = async (req, res) => {
    const params = _utilities.request.getParameters(req)
    const result = await _controllers.auth.logout(params)

    res.json(result)
  }

  const validateEmail = async (req, res) => {
    const params = _utilities.request.getParameters(req)
    const result = await _controllers.auth.validateEmail(params)

    res.json(result)
  }

  const validateAccountChatbot = async (req, res) => {
    const params = _utilities.request.getParameters(req)
    const result = await _controllers.auth.validateAccountChatbot(params)

    res.json(result)
  }

  return {
    login,
    logout,
    validateEmail,
    validateAccountChatbot
  }
}

module.exports = authRoute
