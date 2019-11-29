/* global Vue, popup, b64, format, time, auth, find, localization, loader, parameters
   userService, notificationService */
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
    userService,
    notificationService],
  data: {
    vueBind: {
      model: {
        notifications: [],
        user: {}
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
      await this.getUser()
      this.getAllNotifications()

      if (!this.vueBind.model.user.business_id) {
        window.location.assign('/account/getting-started?issue=b-0001')
      }
    },
    async getUser () {
      const userData = this.$cookies.get('user_data')

      if (userData) {
        this.vueBind.model.user = userData
        return
      }

      if (!window.context.identity) {
        this.showError({ message: 'Please, login again' })
        return
      }

      const userResponse = await this.services.user.getByIdentity({ identity: window.context.identity })

      if (!userResponse || !userResponse.success) {
        this.showDefaultError(userResponse)
        return
      }

      this.$cookies.set('user_data', userResponse.result, '1d', '/')
      this.vueBind.model.user = userResponse.result

      return this.vueBind.model.user
    },
    async getAllNotifications () {
      const notificationsResponse = await this.services.notification.getAllLastByReceiver({
        receiver: this.vueBind.model.user.id || window.context.identity || ''
      })

      if (notificationsResponse && notificationsResponse.success) {
        this.vueBind.model.notifications = notificationsResponse.result
      }
    }
  }
})
