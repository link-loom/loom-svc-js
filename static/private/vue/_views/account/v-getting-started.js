/* global Vue, popup, b64, format, time, auth, find, localization, loader, parameters
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
        notification_type: 'REPLACE-ME',
        notifications: [],
        user: {},
        businessTypes: [
          {
            name: 'food',
            img: '/private/img/food.svg',
            text: 'Food & drink'
          },
          {
            name: 'barbershop',
            img: '/private/img/barbershop.svg',
            text: 'Salons & barbershops'
          },
          {
            name: 'cafe',
            img: '/private/img/cafe.svg',
            text: 'Cafe & small restaurants'
          },
          {
            name: 'fashion',
            img: '/private/img/fashion.svg',
            text: 'Fashion & Apparel'
          },
          {
            name: 'home',
            img: '/private/img/home.svg',
            text: 'Home, lifestyle & gifts'
          },
          {
            name: 'sports',
            img: '/private/img/sports.svg',
            text: 'Sports, hobbies & toys'
          },
          {
            name: 'health',
            img: '/private/img/health.svg',
            text: 'Health & beauty'
          },
          {
            name: 'other',
            img: '/private/img/other.svg',
            text: 'Other'
          }
        ],
        storesCount: [
          {
            id: 1,
            text: '1'
          },
          {
            id: 2,
            text: '2-5'
          },
          {
            id: 3,
            text: '5+'
          }
        ],
        storeCountSelected: {}
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
      this.getUser()
      this.getAllNotifications()

      this.storeCountOnClick(null, this.vueBind.model.storesCount[0])

      this.hideLoader()
    },
    async getUser () {
      const userData = this.$cookies.get('user_data')

      if (userData) {
        this.vueBind.model.user = userData
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
    retailTypeOnClick (event, type) {
      if (event) { event.preventDefault() }

      this.vueBind.model.business.type = type
    },
    storeCountOnClick (event, storeCount) {
      if (event) { event.preventDefault() }

      this.vueBind.model.storeCountSelected = storeCount
    },
    async createBusiness () {
      this.vueBind.model.business.manager_id = this.vueBind.model.user.id
      const createResponse = await this.services.business.create(this.vueBind.model.business)

      if (!createResponse || !createResponse.success) {
        this.hideLoader()
        this.showDefaultError(createResponse)
        return
      }

      this.vueBind.model.user.business_id = createResponse.result.id
      this.$cookies.set('user_data', this.vueBind.model.user, '1d', '/')
    },
    async createAndContinueMultipleOnClick (event) {
      if (event) { event.preventDefault() }

      this.showLoader()

      this.createBusiness()

      window.location.assign('/account/store-configuration')
    },
    async createAndContinueSingleOnClick (event) {
      if (event) { event.preventDefault() }

      this.showLoader()

      await this.createBusiness()

      window.location.assign('/dashboard')
    }
  }
})
