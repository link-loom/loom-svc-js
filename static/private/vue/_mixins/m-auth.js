// eslint-disable-next-line no-unused-vars
var auth = {
  methods: {
    logoutOnClick (event) {
      if (event) { event.preventDefault() }
      this.$cookies.keys().forEach(cookie => this.$cookies.remove(cookie))
      window.location.assign('/login')
    }
  }
}
