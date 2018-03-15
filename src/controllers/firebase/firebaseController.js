function firebase(dependencies) {
  var _firebaseCredentials = '';
  var _firebaseURL = '';

  const setSettings = () => {
    setFirebaseCredentials(dependencies.config.firebase);
    setFirebaseURL(dependencies.config.firebaseDatabase);
  }

  const getFirebaseCredentials = () => {
    return _firebaseCredentials;
  }

  const setFirebaseCredentials = (firebaseCredentials) => {
    _firebaseCredentials = firebaseCredentials;
  }

  const getFirebaseURL = () => {
    return _firebaseURL;
  }

  const setFirebaseURL = (firebaseURL) => {
    _firebaseURL = firebaseURL
  }

  

  const castSnapshot = snapshot => {
    let returnArr = [];

    snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      returnArr.push(item);
    });

    return returnArr;
  }

  return {
    SetSettings: setSettings,
    GetFirebaseCredentials: getFirebaseCredentials,
    GetFirebaseURL: getFirebaseURL,
    CastSnapshot: castSnapshot,
  }
}

module.exports = firebase;
