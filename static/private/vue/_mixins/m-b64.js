// eslint-disable-next-line no-unused-vars
var b64 = {
  methods: {
    b64Encode (data) {
      return window.btoa(typeof data === 'string' ? data : JSON.stringify(data))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    },
    b64Decode (data) {
      return window.atob(typeof data === 'string' ? data : JSON.stringify(data))
    }
  }
}
