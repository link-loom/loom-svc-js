/* global Vue, popup, b64, format, time, auth, find, localization, loader, parameters
   userService, notificationService, accountingBookService, franchiseService, businessService */
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
    notificationService,
    accountingBookService,
    franchiseService,
    businessService],
  data: {
    vueBind: {
      model: {
        notifications: [],
        user: {},
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
      await this.getUser()
      this.getAllNotifications()
      await this.getBusinesses()
      await this.getFranchises()

      if (!this.vueBind.model.user.business_id) {
        window.location.assign('/account/getting-started?issue=b-0001')
      }
    },
    async getFranchises () {
      if (!this.vueBind.model.businesses || this.vueBind.model.businesses.length <= 0) {
        this.configureBusiness()
        return
      }

      this.vueBind.model.businesses.map(async (business) => {
        const response = await this.services.franchise.getAllByBusinessId({ business_id: business })

        if (response && response.success) {
          if (this.vueBind.model.franchises && this.vueBind.model.franchises.length > 0) {
            response.result.map(franchise => {
              this.vueBind.model.franchises.push(franchise)
            })
          } else {
            this.vueBind.model.franchises = response.result
          }

          this.hideLoader()

          this.getBalances()
        } else {
          this.showDefaultError(response)
        }
      })
    },
    async getBusinesses () {
      const response = await this.services.business.getAllByManagerId({
        manager_id: this.vueBind.model.user.id
      })

      if (!response || !response.success) {
        this.showDefaultError(response)
        return
      }

      this.vueBind.model.businesses = response.result

      if (!this.vueBind.model.businesses || this.vueBind.model.businesses.length <= 0) {
        this.configureBusiness()
        return
      }

      return response.result
    },
    configureBusiness: async function () {
      window.location.assign('/account/getting-started')
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
    franchiseCardOnClick: function (event, franchise) {
      if (event) { event.preventDefault() }

      window.location.assign(`/business/franchise/balance?franchise_id=${franchise.id}`)
    },
    getBalances: function () {
      this.getAccountingBooks()
    },
    getAccountingBooks: function () {
      this.vueBind.model.franchises.map((franchise) => {
        this.services.accountingBook.getLastAccountingBookSheetByFranchiseId(franchise, (sheetResult) => {
          if (sheetResult && sheetResult.success) {
            franchise.accountingBook = sheetResult.result
            franchise.name = franchise.name + ' '
          }
        })
      })
    }
  }
})
