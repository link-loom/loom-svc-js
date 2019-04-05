function firebase (dependencies) {
  var _firebaseAdminCredentials = ''
  let _firebaseCredentials = ''
  let _firebaseURL = ''
  let _storageBucket = ''

  const setSettings = () => {
    setFirebaseAdminCredentials(dependencies.config.FIREBASE_ADMIN)
    setFirebaseCredentials(dependencies.config.FIREBASE)
    setFirebaseURL(dependencies.config.firebaseDatabase)
    setStorageBucketURL(dependencies.config.firebaseStorageBucket)
  }

  const getStorageBucketURL = () => {
    return _storageBucket
  }

  const setStorageBucketURL = (firebaseStorageBucketUrl) => {
    _storageBucket = firebaseStorageBucketUrl
  }

  const getFirebaseCredentials = () => {
    return _firebaseCredentials
  }

  const setFirebaseCredentials = (firebaseCredentials) => {
    _firebaseCredentials = firebaseCredentials
  }

  const getFirebaseAdminCredentials = () => {
    return _firebaseAdminCredentials
  }

  const setFirebaseAdminCredentials = (firebaseAdminCredentials) => {
    _firebaseAdminCredentials = firebaseAdminCredentials
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
    setSettings,
    getFirebaseURL,
    getStorageBucketURL,
    getFirebaseCredentials,
    getFirebaseAdminCredentials,
    cast: {
      array: castArraySnapshot,
      object: castObjectSnapshot
    }
  }
}

module.exports = firebase
