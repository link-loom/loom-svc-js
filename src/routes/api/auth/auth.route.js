function authRoute (dependencies) {
  const _utilities = dependencies.utilities
  const _controllers = dependencies.controllers

  /**
     * Login user
     *
     * route to show message (POST http://<<URL>>/api/login/:id)
     */
  const login = async (req, res) => {
    const authController = new _controllers.AuthController(dependencies)
    const params = _utilities.request.getParameters(req)
    let response = {}

    response = await authController.login(params)

    res.json(response)
  }

  const logout = async (req, res) => {
    const authController = new _controllers.AuthController(dependencies)
    const params = _utilities.request.getParameters(req)
    let response = {}

    response = await authController.logout(params)

    res.json(response)
  }

  const validateEmail = async (req, res) => {
    const authController = new _controllers.AuthController(dependencies)
    const params = _utilities.request.getParameters(req)
    let response = {}

    response = await authController.validateEmail(params)

    res.json(response)
  }

  const validateAccountChatbot = async (req, res) => {
    const authController = new _controllers.AuthController(dependencies)
    const params = _utilities.request.getParameters(req)
    let response = {}

    response = await authController.validateAccountChatbot(params)

    res.json(response)
  }

  return {
    login,
    logout,
    validateEmail,
    validateAccountChatbot
  }
}

module.exports = authRoute
