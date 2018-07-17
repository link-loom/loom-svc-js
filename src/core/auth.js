function auth (dependencies) {
  /// Dependencies
  const _console = dependencies.console
  const _bcrypt = dependencies.bcrypt
  const _jwt = dependencies.jwt
  const _utilities = dependencies.utilities
  const _aesjs = dependencies.aesjs
  const _crypto = dependencies.crypto

  /// Properties
  const generatePrivateKey = function (seed) {
    // Get a 32 bit hash from given seed
    let hashString = _crypto.createHash('sha256').update(seed || '', 'utf8').digest('hex').slice(0, 32)
    // Cast the string to a array buffer
    let hashBuffer = Uint8Array.from(hashString, (x) => x.charCodeAt(0))
    // Cast array buffer to array int
    return [...hashBuffer]
  }

  const key = generatePrivateKey(dependencies.config.BACKEND_SECRET)

  const cypherObject = (data) => {
    if (data && typeof data === 'object') {
      // Convert data to bytes
      let dataBytes = _aesjs.utils.utf8.toBytes(JSON.stringify(data))

      // Turns a block cipher into a stream cipher. It generates the next keystream
      // block by encrypting successive values of a "counter"
      let aesCTR = new _aesjs.ModeOfOperation.ctr(key, new _aesjs.Counter(5))
      let encryptedBytes = aesCTR.encrypt(dataBytes)

      // convert bytes it to hex, is to handle in Key Vault Network
      let encryptedHex = _aesjs.utils.hex.fromBytes(encryptedBytes)

      return encryptedHex
    } else {
      return null
    }
  }

  const decipherObject = (data) => {
    if (data && typeof data === 'string') {
      // When ready to decrypt the hex string, convert it back to bytes
      let encryptedBytes = _aesjs.utils.hex.toBytes(data)

      // The counter mode of operation maintains internal state, so to
      // decrypt a new instance must be instantiated.
      /* eslint new-cap: ["error", { "properties": false }] */
      let aesCtr = new _aesjs.ModeOfOperation.ctr(key, new _aesjs.Counter(5))
      let decryptedBytes = aesCtr.decrypt(encryptedBytes)

      // Convert our bytes back into text
      let decryptedText = _aesjs.utils.utf8.fromBytes(decryptedBytes)

      try {
        return JSON.parse(decryptedText)
      } catch (error) {
        _console.error(error)
        return null
      }
    }
  }

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
    crypto: {
      cypherObject,
      decipherObject
    },
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
