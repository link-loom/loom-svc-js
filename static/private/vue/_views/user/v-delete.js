/* global Vue, popup, b64, format, time, auth, find, localization, loader, parameters
   notificationService, userService  */
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
    notificationService,
    userService],
  data: {
    vueBind: {
      model: {
        notification_type: 'franchisor',
        notifications: [],
        user: {},
        entity: {}
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
      this.getUser()
      this.getAllNotifications()
      await this.getSelectedEntity()

      this.hideLoader()

      this.checkIssuesMessages()
    },
    async checkIssuesMessages () {
      if (!window.location.queryString || !window.location.queryString.issue) {
        return
      }

      this.showIconPopup(this.issues[window.location.queryString.issue])
    },
    async getUser () {
      const userData = this.$cookies.get('user_data')

      if (userData) {
        this.vueBind.model.user = userData
        return
      }

      const userResponse = await this.services.user.getByParameters({ identity: window.context.identity })

      if (!userResponse || !userResponse.success) {
        this.showDefaultError(userResponse)
        return
      }

      this.$cookies.set('user_data', userResponse.result, '1d', '/')
      this.vueBind.model.user = userResponse.result

      return this.vueBind.model.user
    },
    async getAllNotifications () {
      const entityResponse = await this.services.notification.getByParameters({
        receiver: this.vueBind.model.user.id || window.context.identity || ''
      })

      if (entityResponse && entityResponse.success) {
        this.vueBind.model.notifications = entityResponse.result
      }
    },
    async deleteOnClick (event) {
      if (event) { event.preventDefault() }

      const entityResponse = await this.services.user.update({
        id: window.location.queryString.id,
        status: { id: 3, name: 'deleted', title: 'Deleted' }
      })

      if (!entityResponse || !entityResponse.success) {
        this.showDefaultError(entityResponse)
        return
      }

      window.location.replace('/user/list/')
    },
    async getSelectedEntity () {
      if (!window.location.queryString || !window.location.queryString.id) {
        this.showError({ message: 'Please return and select an user to use this action' })
        return
      }

      const entityResponse = await this.services.user.getByParameters({
        identity: window.location.queryString.id
      })

      if (!entityResponse || !entityResponse.success) {
        this.showDefaultError(entityResponse)
        return
      }

      this.vueBind.model.entity = entityResponse.result
    }
  }
})
