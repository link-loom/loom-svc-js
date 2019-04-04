function firebase (dependencies) {
  var _firebaseCredentials = ''
  var _firebaseURL = ''

  const setSettings = () => {
    setFirebaseCredentials(dependencies.config.firebase)
    setFirebaseURL(dependencies.config.firebaseDatabase)
  }

  const getFirebaseCredentials = () => {
    return _firebaseCredentials
  }

  const setFirebaseCredentials = (firebaseCredentials) => {
    _firebaseCredentials = firebaseCredentials
  }

  const getFirebaseURL = () => {
    return _firebaseURL
  }

  const setFirebaseURL = (firebaseURL) => {
    _firebaseURL = firebaseURL
  }

  const castArraySnapshot = snapshot => {
    if (snapshot) {
      let arr = []
      let obj = {}

      snapshot.forEach(childSnapshot => {
        let item = childSnapshot.val()
        arr.push(item)
      })

      obj.raw = snapshot
      obj.data = arr

      return obj
    } else {
      return null
    }
  }

  const castObjectSnapshot = snapshot => {
    if (snapshot) {
      let item = snapshot.val()
      if (item) {
        let obj = {}

        obj.rawId = Object.keys(item)[0]
        obj.formatted = item[Object.keys(item)[0]]
        obj.raw = item

        return obj
      } else {
        return null
      }
    } else {
      return null
    }
  }

  return {
    setSettings: setSettings,
    getFirebaseCredentials: getFirebaseCredentials,
    getFirebaseURL: getFirebaseURL,
    cast: {
      array: castArraySnapshot,
      object: castObjectSnapshot
    }
  }
}

module.exports = firebase
