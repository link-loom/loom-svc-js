/* global Vue, popup, b64, format, time, auth, find, localization, loader, parameters
   notificationService, userService, roleService */
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
    userService,
    roleService],
  data: {
    vueBind: {
      model: {
        notifications: [],
        user: {},
        entity: {
          role: { id: 0 }
        },
        roles: []
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
      this.getAllNotifications()

      await this.getUser()
      await this.getSelectedUser()
      await this.getRoles()

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
    async getRoles () {
      const rolesResponse = await this.services.role.getAll()

      if (!rolesResponse || !rolesResponse.success) {
        return
      }

      this.vueBind.model.roles = rolesResponse.result
    },
    async getSelectedUser () {
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
