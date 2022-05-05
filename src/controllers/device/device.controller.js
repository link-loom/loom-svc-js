class DeviceController {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies
    this._db = dependencies.db
    this._models = dependencies.models
    this._utilities = dependencies.utilities
    this._console = this._dependencies.console
    this._firebase = dependencies.firebaseManager
    this._controllers = this._dependencies.controllers

    /* Custom Properties */
    /* this._myPrivateProperty = 'Some value' */

    /* Assigments */
    /* this._newPrivateObject = new SomeObject(this._dependencies) */
  }

  async get () {
    try {
      // Get values from reference as snapshot
      const docRef = this._db.collection('devices')
      const docRaw = await docRef.get()
      // Cast Firebase object into an arry of devices
      const entityResponse = this._firebase.cast.array(docRaw)
      const entityCleaned = this._utilities.response.clean(entityResponse)

      return this._utilities.response.success(entityCleaned)
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async getById (data) {
    try {
      if (!data || !data.id) {
        return this._utilities.response.error('Please provide an id')
      }

      // Get values from reference as snapshot
      const docRef = this._db.collection('devices').doc(`${data.id}`)
      const docRaw = await docRef.get()
      // Cast Firebase object into an arry of devices
      const entityResponse = this._firebase.cast.object(docRaw)

      // Check if exist any data
      if (!docRaw || !docRaw.exists || !entityResponse) {
        return this._utilities.response.error('No device found')
      }

      return this._utilities.response.success(this._utilities.response.clean(entityResponse))
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async getByDeviceId (data) {
    try {
      if (!data || !data.deviceId) {
        return this._utilities.response.error('Please provide a deviceid')
      }

      // Get values from reference as snapshot
      const docRef = this._db.collection('devices')
        .where('device_id', '==', `${data.deviceId}`)
      const docRaw = await docRef.get()
      // Cast Firebase object into an arry of devices
      const entityResponse = this._firebase.cast.array(docRaw)

      // Check if exist any data
      if (!docRaw || !entityResponse || entityResponse.data.length <= 0) {
        return this._utilities.response.error('No device found')
      }

      return this._utilities.response.success(entityResponse.data[0])
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async getByFingerprint (data) {
    try {
      if (!data || !data.fingerprint) {
        return this._utilities.response.error('Please provide a fingerprint')
      }

      // Get values from reference as snapshot
      const docRef = this._db.collection('devices')
        .where('fingerprint', '==', `${data.fingerprint}`)
      const docRaw = await docRef.get()
      // Cast Firebase object into an arry of devices
      const entityResponse = this._firebase.cast.array(docRaw)

      // Check if exist any data
      if (!docRaw || !entityResponse || entityResponse.data.length <= 0) {
        return this._utilities.response.error('No device found')
      }

      return this._utilities.response.success(entityResponse.data[0])
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async getByIdentity (data) {
    try {
      if (!data || !data.identity) {
        return this._utilities.response.error('Please provide a phone number, dni or email')
      }

      let userResult = await this.getByDeviceId({ device: data.identity })
      if (this._utilities.response.isValid(userResult)) {
        return userResult
      }

      userResult = await this.getByFingerprint({ fingerprint: data.identity })
      if (this._utilities.response.isValid(userResult)) {
        return userResult
      }

      userResult = await this.getById({ id: data.identity })
      if (this._utilities.response.isValid(userResult)) {
        return userResult
      }

      return this._utilities.response.error('Device not found')
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async create (data) {
    try {
      if (!data || !data.fingerprint) {
        return this._utilities.response.error('Please provide minimum data')
      }

      const deviceResponse = await this.getByFingerprint(data)
      if (this._utilities.response.isValid(deviceResponse)) {
        return this._utilities.response.error('Provided device is already registered')
      }

      data.id = this._utilities.idGenerator(15, 'devi-')
      const docRef = this._db.collection('devices').doc(data.id)

      const entity = new this._models.Device(data, this._dependencies)
      const docResponse = await docRef.set(entity.get)

      if (!docResponse) {
        this._console.error(docResponse)
        return this._utilities.response.error()
      }

      return this._utilities.response.success(entity.sanitized)
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async update (data) {
    try {
      if (!data || !data.fingerprint) {
        return this._utilities.response.error('Please provide an fingerprint')
      }
      const entityResponse = await this.getByFingerprint(data)

      if (!this._utilities.response.isValid(entityResponse)) {
        return entityResponse
      }

      const docRef = this._db.collection('devices').doc(entityResponse.result.id)
      const entity = new this._models.Device({ ...entityResponse.result, ...data }, this._dependencies)
      const docResponse = await docRef.update(entity.get)

      if (!docResponse) {
        this._console.error(docResponse)
        return this._utilities.response.error()
      }

      return this._utilities.response.success(data)
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  get status () {
    return this._models.Device.statuses
  }
}

module.exports = DeviceController
