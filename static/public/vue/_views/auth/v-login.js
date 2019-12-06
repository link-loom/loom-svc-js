/* global Vue, popup, b64, format, time, auth, find, authService, localization loader, parameters
 */
window.app = new Vue({
  el: '#vue-app',
  mixins: [
    popup,
    b64,
    format,
    time,
    auth,
    find,
    localization,
    loader,
    parameters,
    authService],
  data: {
    vueBind: {
      model: {
        identity: '',
        password: ''
      },
      paths: {},
      visibility: {},
      style: {}
    }
  },
  mounted () {
    window.context = {
      identity: this.$cookies.get('user_identity'),
      token: this.$cookies.get('user_session')
    }

    this.initializeView()
  },
  methods: {
    async initializeView () {
      this.hideLoader()
    },
    async login () {
      this.showLoader()

      if (!this.vueBind.model.identity) {
        this.showError({ message: 'Type a pin to login' })
        return
      }

      if (!this.vueBind.model.password) {
        this.showError({ message: 'Type a password to login' })
        return
      }

      const loginResponse = await this.services.auth.login({
        identity: this.vueBind.model.identity,
        password: this.vueBind.model.password
      })

      if (!loginResponse || !loginResponse.success || loginResponse.result.auth !== true) {
        this.showError(loginResponse)
        this.hideLoader()
        return
      }

      this.$cookies.set('user_session', loginResponse.result.token, `${loginResponse.result.payload.session_time}d`, '/')
      this.$cookies.set('user_identity', loginResponse.result.payload.identity, `${loginResponse.result.payload.session_time}d`, '/')

      if (window.location.queryString && window.location.queryString.redirect) {
        window.location.assign(unescape(window.location.queryString.redirect))
      } else {
        window.location.assign('/')
      }
    },
    loginOnClick: function (event) {
      if (event) { event.preventDefault() }

      if (!this.vueBind.model.identity || this.vueBind.model.identity.length <= 5) {
        this.showError({ message: 'Your pin is your national identity and must have at least 5 characters' })
        return
      }

      if (!this.vueBind.model.password || this.vueBind.model.password.length <= 3) {
        this.showError({ message: 'You need to type your password and must have at least 3 characters' })
        return
      }

      this.login()
    },
    numberPadOnClick: function (event) {
      if (event) { event.preventDefault() }

      this.vueBind.model.identity += '' + event.target.textContent
    }
  }
})
