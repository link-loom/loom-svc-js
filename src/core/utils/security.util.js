class SecurityUtil {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies

    /* Custom Properties */

    /* Assigments */
    this._namespace = '[Server]::[Utils]::[Serializer]'
  }

  get serializer () {
    return {
      object: {
        toQueryString: this.#objectToQueryString.bind(this)
      }
    }
  }

}

module.exports = SecurityUtil
