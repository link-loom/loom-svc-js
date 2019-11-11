class FirebaseManager {
  constructor (dependencies) {
    this._dependencies = dependencies
    this._console = dependencies.console

    this._firebaseAdminCredentials = ''
    this._firebaseCredentials = ''
    this._firebaseURL = ''
  }

  setSettings () {
    this.setFirebaseAdminCredentials(this._dependencies.config.FIREBASE_ADMIN)
    this.setFirebaseCredentials(this._dependencies.config.FIREBASE)
    this.setFirebaseURL(this._dependencies.config.firebaseDatabase)
  }

  getFirebaseCredentials () {
    return this._firebaseCredentials
  }

  setFirebaseCredentials (firebaseCredentials) {
    this._firebaseCredentials = firebaseCredentials
  }

  getFirebaseAdminCredentials () {
    return this._firebaseAdminCredentials
  }

  setFirebaseAdminCredentials (firebaseAdminCredentials) {
    this._firebaseAdminCredentials = firebaseAdminCredentials
  }

  getFirebaseURL () {
    return this._firebaseURL
  }

  setFirebaseURL (firebaseURL) {
    this._firebaseURL = firebaseURL
  }

  castArraySnapshot (snapshot) {
    if (snapshot) {
      const arr = []
      const obj = {}

      snapshot.forEach(childSnapshot => {
        const item = childSnapshot.val()
        arr.push(item)
      })

      obj.raw = snapshot
      obj.data = arr

      return obj
    } else {
      return null
    }
  }

  castObjectSnapshot (snapshot) {
    if (snapshot) {
      const item = snapshot.val()
      if (item) {
        const obj = {}

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

  get cast () {
    return {
      array: this.castArraySnapshot.bind(this),
      object: this.castObjectSnapshot.bind(this)
    }
  }
}

module.exports = { FirebaseManager }
