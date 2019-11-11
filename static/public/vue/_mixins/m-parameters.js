/* global */
// eslint-disable-next-line no-unused-vars
var parameters = {
  methods: {
    serializerOjectToQueryString: function (obj, prefix) {
      if (obj && typeof obj === 'object') {
        const serializedArr = []
        let key = {}

        for (key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const k = prefix ? prefix + '[' + key + ']' : key
            const value = obj[key] || null
            serializedArr.push((value !== null && typeof value === 'object')
              ? this.serializerOjectToQueryString(value, k)
              : encodeURIComponent(k) + '=' + encodeURIComponent(value))
          }
        }
        return serializedArr.join('&')
      }
    },
    objectToQueryString: function (obj) {
      if (obj && typeof obj === 'object') {
        const result = this.serializerOjectToQueryString(obj)
        return `?${result}`
      } else {
        return ''
      }
    }
  }
}
