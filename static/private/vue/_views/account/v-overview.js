/* global Vue, popup, b64, format, time, auth, find, localization, loader, parameters
   notificationService, localeService */
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
    localeService],
  data: {
    vueBind: {
      model: {
        notification_type: 'REPLACE-ME',
        notifications: [],
        user: {},
        plan: {
          name: 'Free',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dictum porttitor risus.',
          price: '0',
          next_payment: '10/2/19'
        },
        langs: [],
        lang: {}
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
      this.setAllLocalizationLinks()
      this.getUser()
      this.getAllNotifications()

      this.hideLoader()

      this.getAllLocales()
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
    async getAllLocales () {
      const localesResponse = await this.services.locale.getAllLocales()

      if (!localesResponse || !localesResponse.success) {
        this.showDefaultError(localesResponse)
        return
      }

      this.vueBind.model.langs = localesResponse.result
      this.searchCurrentLang()
    },
    searchCurrentLang () {
      this.vueBind.model.lang = this.findObjectByKey(
        this.$cookies.get('lang'),
        'country_iso_code',
        this.vueBind.model.langs
      )
    },
    findObjectByKey (query, key, _array) {
      if (!query) {
        return null
      }
      return _array.find(function (element, index) {
        return element[key].toLocaleLowerCase() === query.toLocaleLowerCase()
      })
    },
    setCurrentLang (event) {
      if (event) { event.preventDefault() }

      if (!this.vueBind.model.lang) {
        return
      }

      this.$cookies.set('lang', this.vueBind.model.lang.country_iso_code.toLocaleLowerCase())

      this.showSuccess({ title: 'Language changed', message: 'Now refresh this page or navigate to another' })
    }
  }
})
