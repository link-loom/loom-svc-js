/* global $, Vue, popup, b64, format, time, auth, find, localization, loader, parameters
   notificationService, userService */
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
        users: []
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

      await this.getAllUsers()

      this.hideLoader()
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
    async getAllUsers () {
      const usersResponse = await this.services.user.getAllByBusinessId({
        business_id: this.vueBind.model.user.business_id
      })

      if (usersResponse && usersResponse.success) {
        this.vueBind.model.users = usersResponse.result

        setTimeout(() => {
          this.setupDataTable()
        }, 0)
      }
    },
    setupDataTable () {
      $('#order-listing').DataTable({
        aLengthMenu: [
          [5, 10, 15, -1],
          [5, 10, 15, 'All']
        ],
        iDisplayLength: 10,
        language: {
          search: ''
        }
      })
      $('#order-listing').each(function () {
        var datatable = $(this)
        // SEARCH - Add the placeholder for Search and Turn this into in-line form control
        var searchInput = datatable.closest('.dataTables_wrapper').find('div[id$=_filter] input')
        searchInput.attr('placeholder', 'Search')
        searchInput.removeClass('form-control-sm')
        // LENGTH - Inline-Form control
        var lengthSel = datatable.closest('.dataTables_wrapper').find('div[id$=_length] select')
        lengthSel.removeClass('form-control-sm')
      })
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
