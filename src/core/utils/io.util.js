class IOUtil {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies

    /* Custom Properties */

    /* Assigments */
    this._namespace = '[Server]::[Utils]::[IO]'
  }

  #getParameters (data) {
    if (!data) { return {} }

    let params = {}

    if (!this.isEmpty(data.query)) {
      params = { ...params, ...data.query }
    }
    if (!this.isEmpty(data.body)) {
      params = { ...params, ...data.body }
    }
    if (!this.isEmpty(data.params)) {
      params = { ...params, ...data.params }
    }

    return params
  }

  #throwError (message, { status }) {
    if (message) {
      return {
        status: status || 500,
        success: false,
        message: message,
        result: null
      }
    }

    return {
      status: status || 500,
      success: false,
      message: 'Something was wrong while you make this action',
      result: null
    }
  }

  #throwSuccess (data, message, { status } = {}) {
    return {
      status: status || 200,
      success: true,
      message: message || 'Operation completed successfully',
      result: data || {}
    }
  }

  #responseIsValid (property) {
    let isValid = false

    if (property && property.success === true) {
      isValid = true
    }

    return isValid
  }

  #cleanObjectData (rawObj) {
    if (rawObj && rawObj.formatted) {
      return rawObj.formatted
    } else if (rawObj && rawObj.data) {
      return rawObj.data
    } else {
      return null
    }
  }

  get request () {
    return {
      getParameters: this.#getParameters.bind(this)
    }
  }

  get response () {
    return {
      success: this.#throwSuccess.bind(this),
      error: this.#throwError.bind(this),
      isValid: this.#responseIsValid.bind(this),
      clean: this.#cleanObjectData.bind(this)
    }
  }

}

module.exports = IOUtil
