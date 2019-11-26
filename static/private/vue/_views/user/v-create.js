/* global Vue, popup, b64, format, time, auth, find, localization, loader, parameters
   notificationService, franchiseService, roleService, userService */
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
    franchiseService,
    roleService,
    userService],
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
      visibility: {
        userRoleIsSelected: false
      },
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

      const franchisesResponse = await this.services.franchise.getAllByBusinessId({
        business_id: this.vueBind.model.user.business_id
      })

      if (franchisesResponse && franchisesResponse.success) {
        this.vueBind.model.franchises = franchisesResponse.result

        this.hideLoader()
      } else {
        this.showDefaultError(franchisesResponse)
      }

      const rolesResponse = await this.services.role.getAll()

      if (!rolesResponse || !rolesResponse.success) {
        return
      }

      this.vueBind.model.roles = rolesResponse.result
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
    },
    selectRoleOnClick: function (event, role) {
      if (event) { event.preventDefault() }

      if (!role) {
        this.showError({ title: 'Oops!', message: 'Select a role first' })
        return
      }

      this.vueBind.model.newUser.role = role
      this.vueBind.visibility.userRoleIsSelected = true
    },
    async createUserOnClick (event) {
      if (event) { event.preventDefault() }

      if (!this.vueBind.model.newUser.identity) {
        this.showError({ message: 'Provide at least an identity' })
        return
      }

      this.vueBind.model.newUser.business_id = this.vueBind.model.user.business_id
      this.vueBind.model.newUser.franchisor_id = this.vueBind.model.user.franchisor_id

      if (this.vueBind.model.newUser.role.name.toLocaleLowerCase() === 'franchise' ||
        this.vueBind.model.newUser.role.name.toLocaleLowerCase() === 'franchisor') {
        const userResult = await this.services.user.create(this.vueBind.model.newUser)

        if (!userResult) {
          this.showDefaultError(userResult)
          return
        }

        await window.Swal.fire({
          title: 'User created!',
          text: 'We have confirmed the creation of the user, can now authenticate and work.',
          type: 'success',
          confirmButtonClass: 'btn-success',
          confirmButtonText: 'Continuar'
        })

        window.location.reload()
      } else {
        this.showError({ message: 'You\'re not allowed to select this role' })
      }
    },
    returnOnClick (event) {
      if (event) { event.preventDefault() }

      window.location.assign('user/list/')
    }
  }
})
