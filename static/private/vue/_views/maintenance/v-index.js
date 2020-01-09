/* global Vue, popup, b64, format, time, auth, find, localization, loader, parameters
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
    parameters],
  data: {
    vueBind: {
      model: {
        notification_type: 'REPLACE-ME',
        notifications: [],
        user: {},
        message: '',
        code: '',
        error: ''
      }
    },
    issues: {
      '[CODE]': {
        title: '[TITLE]',
        message: '[MESSAGE]'
      }
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
      if (window.location.queryString) {
        if (!window.location.origin.includes('localhost') && window.location.queryString.code === '500') {
          this.vueBind.model.message = ''
          this.vueBind.model.code = '503'
          this.vueBind.model.error = 'Something was wrong'

          return
        }

        this.vueBind.model.message = window.location.queryString.message || ''
        this.vueBind.model.code = window.location.queryString.code || '404'
        this.vueBind.model.error = window.location.queryString.error || ''
      }

      this.hideLoader()

      this.checkIssuesMessages()
    },
    async checkIssuesMessages () {
      if (!window.location.queryString || !window.location.queryString.issue) {
        return
      }

      this.showIconPopup(this.issues[window.location.queryString.issue])
    }
  }
})
