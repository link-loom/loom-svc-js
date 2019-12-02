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
        entities: []
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
      await this.getUser()
      this.getAllNotifications()

      await this.getAllEntities()

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
    async getAllEntities () {
      const entityResponse = await this.services.user.getByParameters({
        business_id: this.vueBind.model.user.business_id
      })

      if (entityResponse && entityResponse.success) {
        this.vueBind.model.entities = entityResponse.result

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
      $('#order-listing').each(() => {
        // SEARCH - Add the placeholder for Search and Turn this into in-line form control
        const searchInput = $(this).closest('.dataTables_wrapper').find('div[id$=_filter] input')
        searchInput.attr('placeholder', 'Search')
        searchInput.removeClass('form-control-sm')
        // LENGTH - Inline-Form control
        const lengthSel = $(this).closest('.dataTables_wrapper').find('div[id$=_length] select')
        lengthSel.removeClass('form-control-sm')
      })
    },
    async getAllNotifications () {
      const entityResponse = await this.services.notification.getByParameters({
        receiver: this.vueBind.model.user.id || window.context.identity || ''
      })

      if (entityResponse && entityResponse.success) {
        this.vueBind.model.notifications = entityResponse.result
      }
    }
  }
})
