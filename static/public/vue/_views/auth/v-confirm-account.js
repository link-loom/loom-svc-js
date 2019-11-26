/* global Vue, popup, b64, format, time, auth, find, localization, loader, parameters authService */
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
        email: ''
      },
      paths: {
        resendNotification: '/api/resend-email-validation'
      },
      visibility: {},
      style: {}
    }
  },
  mounted () {
    window.context = {
      userId: this.$cookies.get('vca_id'),
      token: this.$cookies.get('vca_auth')
    }

    this.initializeView()
    this.hideLoader()
  },
  methods: {
    initializeView: function () {
      if (!window.location.queryString.email) {
        this.showError({ message: 'Thanks for register to VCA but something was wrong, please check your inbox if you do not have any email from us register again.' })
        return
      }

      this.vueBind.model.email = window.location.queryString.email
    },
    /* resendNotification: function (next) {
      this.$http.post(
        this.vueBind.paths.resendNotification,
        { to: this.vueBind.model.email },
        { emulateJSON: true })
        .then(result => {
          next(result.body);
        }, error => {
          console.error(error);
          next(error.body);
        });
    }, */
    async sendEmailAgainOnClick (event) {
      if (event) { event.preventDefault() }

      if (!this.vueBind.model.email || !this.vueBind.model.email.length <= 0) {
        this.showError({ message: 'Please provide an email' })
        return
      }

      const resendResponse = await this.services.auth.resendEmail({ to: this.vueBind.model.email })

      if (!resendResponse || !resendResponse.success) {
        this.showDefaultError(resendResponse)
        return
      }

      this.showSuccess({
        title: 'Confirmation email resent',
        message: 'Please check junk mail'
      })
    }
  }
})
