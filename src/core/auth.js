function auth (dependencies) {
  /// Dependencies
  const _console = dependencies.console
  const _bcrypt = dependencies.bcrypt
  const _jwt = dependencies.jwt
  const _utilities = dependencies.utilities

  /// Properties

  const stringToHash = (data) => {
    if (data && typeof data === 'string') {
      return _bcrypt.hashSync(data, 8)
    } else {
      return null
    }
  }

  const destroyToken = () => {
    return { auth: false, token: null }
  }

  const createToken = (data) => {
    try {
      if (data) {
        let token = _jwt.sign(data, dependencies.config.JWT_SECRET, {
          expiresIn: 86400 // expires in 24 hours
        })
        return { userId: data.userId, auth: true, token: token }
      } else {
        return null
      }
    } catch (error) {
      _console.error(error)
      return null
    }
  }

  const validateApi = (req, res, next) => {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token']

    // decode token
    if (token) {
      // verifies secret and checks exp
      _jwt.verify(token, dependencies.config.JWT_SECRET, function (err, decoded) {
        if (err) {
          return res.status(403).send(_utilities.response.error('Failed to authenticate token.'))
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded
          next()
        }
      })
    } else {
      // if there is no token return an error
      return res.status(403).send(_utilities.response.error('No token provided.'))
    }
  }

  const compare = (data) => {
    let passwordIsValid = false
    if (data.receivedPassword && data.hash) {
      passwordIsValid = _bcrypt.compareSync(data.receivedPassword, data.hash)
    }
    return passwordIsValid
  }

  return {
    hash: {
      stringToHash,
      isValid: compare
    },
    token: {
      create: createToken,
      destroy: destroyToken
    },
    middleware: {
      validateApi
    }
  }
}

module.exports = auth
