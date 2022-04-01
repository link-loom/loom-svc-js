function deviceController (dependencies) {
  const _db = dependencies.db
  const _console = dependencies.console
  const _firebase = dependencies.firebaseManager
  const _utilities = dependencies.utilities
  const _models = dependencies.models

  const get = async () => {
    try {
      // Get values from reference as snapshot
      const docRef = _db.collection('devices')
      const docRaw = await docRef.get()
      // Cast Firebase object into an arry of devices
      const entityResponse = _firebase.cast.array(docRaw)
      const entityCleaned = _utilities.response.clean(entityResponse)

      return _utilities.response.success(entityCleaned)
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const getById = async (data) => {
    try {
      if (!data || !data.id) {
        return _utilities.response.error('Please provide an id')
      }

      // Get values from reference as snapshot
      const docRef = _db.collection('devices').doc(`${data.id}`)
      const docRaw = await docRef.get()
      // Cast Firebase object into an arry of devices
      const entityResponse = _firebase.cast.object(docRaw)

      // Check if exist any data
      if (!docRaw || !docRaw.exists || !entityResponse) {
        return _utilities.response.error('No device found')
      }

      return _utilities.response.success(_utilities.response.clean(entityResponse))
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const getByDeviceId = async (data) => {
    try {
      if (!data || !data.deviceId) {
        return _utilities.response.error('Please provide a deviceid')
      }

      // Get values from reference as snapshot
      const docRef = _db.collection('devices')
        .where('device_id', '==', `${data.deviceId}`)
      const docRaw = await docRef.get()
      // Cast Firebase object into an arry of devices
      const entityResponse = _firebase.cast.array(docRaw)

      // Check if exist any data
      if (!docRaw || !entityResponse || entityResponse.data.length <= 0) {
        return _utilities.response.error('No device found')
      }

      return _utilities.response.success(entityResponse.data[0])
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const getByFingerprint = async (data) => {
    try {
      if (!data || !data.fingerprint) {
        return _utilities.response.error('Please provide a fingerprint')
      }

      // Get values from reference as snapshot
      const docRef = _db.collection('devices')
        .where('fingerprint', '==', `${data.fingerprint}`)
      const docRaw = await docRef.get()
      // Cast Firebase object into an arry of devices
      const entityResponse = _firebase.cast.array(docRaw)

      // Check if exist any data
      if (!docRaw || !entityResponse || entityResponse.data.length <= 0) {
        return _utilities.response.error('No device found')
      }

      return _utilities.response.success(entityResponse.data[0])
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const getByIdentity = async (data) => {
    try {
      if (!data || !data.identity) {
        return _utilities.response.error('Please provide a phone number, dni or email')
      }

      let userResult = await getByDeviceId({ device: data.identity })
      if (_utilities.response.isValid(userResult)) {
        return userResult
      }

      userResult = await getByFingerprint({ fingerprint: data.identity })
      if (_utilities.response.isValid(userResult)) {
        return userResult
      }

      userResult = await getById({ id: data.identity })
      if (_utilities.response.isValid(userResult)) {
        return userResult
      }

      return _utilities.response.error('Device not found')
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const create = async (data) => {
    try {
      if (!data || !data.fingerprint) {
        return _utilities.response.error('Please provide minimum data')
      }

      const deviceResponse = await getByFingerprint(data)
      if (_utilities.response.isValid(deviceResponse)) {
        return _utilities.response.error('Provided device is already registered')
      }

      data.id = _utilities.idGenerator(15, 'devi-')
      const docRef = _db.collection('devices').doc(data.id)

      const entity = new _models.Device(data, dependencies)
      const docResponse = await docRef.set(entity.get)

      if (!docResponse) {
        _console.error(docResponse)
        return _utilities.response.error()
      }

      return _utilities.response.success(entity.sanitized)
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const update = async (data) => {
    try {
      if (!data || !data.fingerprint) {
        return _utilities.response.error('Please provide an fingerprint')
      }
      const entityResponse = await getByFingerprint(data)

      if (!_utilities.response.isValid(entityResponse)) {
        return entityResponse
      }

      const docRef = _db.collection('devices').doc(entityResponse.result.id)
      const entity = new _models.Device({ ...entityResponse.result, ...data }, dependencies)
      const docResponse = await docRef.update(entity.get)

      if (!docResponse) {
        _console.error(docResponse)
        return _utilities.response.error()
      }

      return _utilities.response.success(data)
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  return {
    getAll: get,
    getById,
    getByDeviceId,
    getByFingerprint,
    getByIdentity,
    create,
    update,
    status: _models.Device.statuses
  }
}

module.exports = deviceController
