/* global Vue, popup, b64, format, time, auth, find, localization, loader, parameters
   notificationService, userService, roleService, franchiseService */
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
    roleService,
    franchiseService],
  data: {
    vueBind: {
      model: {
        notifications: [],
        user: {},
        newUser: {
          role: { id: 0 }
        },
        roles: [],
        franchises: []
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
      this.getAllNotifications()

      await this.getUser()
      await this.getSelectedUser()

      const franchisesResponse = await this.services.franchise.getAllByBusinessId({
        business_id: this.vueBind.model.user.business_id
      })

      if (!franchisesResponse || !franchisesResponse.success) {
        this.showDefaultError(franchisesResponse)
        return
      }

      this.vueBind.model.franchises = franchisesResponse.result

      const rolesResponse = await this.services.role.getAll()

      if (!rolesResponse || !rolesResponse.success) {
        return
      }

      this.vueBind.model.roles = rolesResponse.result
      this.hideLoader()
    },
    async getUser () {
      const userData = this.$cookies.get('user_data')

      if (userData) {
        this.vueBind.model.user = userData
        return
      }
      const identity = window.context.identity

      if (!identity) {
        this.showError({ message: 'Please, login again' })
        return
      }
      const userResponse = await this.services.user.getByIdentity(identity)

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
    },
    async getSelectedUser () {
      if (!window.location.queryString || !window.location.queryString.id) {
        this.showError({ message: 'Please return and select an user to use this action' })
        return
      }

      const userResponse = await this.services.user.getByIdentity({
        identity: window.location.queryString.id
      })

      if (!userResponse || !userResponse.success) {
        this.showDefaultError(userResponse)
        return
      }

      this.vueBind.model.newUser = userResponse.result
    }
  }
})
