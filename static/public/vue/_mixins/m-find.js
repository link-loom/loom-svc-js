// eslint-disable-next-line no-unused-vars
var find = {
  methods: {
    findObjectByKey: (query, key, _array) => {
      return _array.find(function (element, index) {
        return element[key] === query
      })
    },
    findAndRemoveByKey: (query, key, _array) => {
      const index = _array.findIndex(function (element, index) {
        return element[key] === query
      })

      if (index > -1) {
        _array.splice(index, 1)
      }
      return index
    }
  }
}
