/* global $, Vue, popup, b64, format, time, auth, find, localization, loader, parameters
   authService, userService, localeService */
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
    authService,
    userService,
    localeService],
  data: {
    vueBind: {
      model: {
        user: {
          firstname: '',
          lastname: '',
          email: '',
          phone: '',
          accept_terms: false,
          password: ''
        },
        countries: [],
        selectedCountry: {}
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
      this.getCountries()

      this.hideLoader()
    },
    async getCountries () {
      const countriesResponse = await this.services.locale.getAllIDDCountries()

      if (!countriesResponse || !countriesResponse.success) {
        this.showDefaultError(countriesResponse)
        return
      }

      this.vueBind.model.countries = countriesResponse.result

      setTimeout(() => {
        if ($('.countries-list').length) {
          $('.countries-list').select2()
        }
      }, 0)
    },
    async createUserOnClick (event) {
      if (event) { event.preventDefault() }

      if (!this.vueBind.model.user.firstname || !this.vueBind.model.user.firstname < 0) {
        this.showError({ message: 'Write a name, please.' })
        return
      }

      if (!this.vueBind.model.user.lastname || !this.vueBind.model.user.lastname < 0) {
        this.showError({ message: 'Write a lastname, please.' })
        return
      }

      if (!this.vueBind.model.user.accept_terms) {
        this.showError({ message: 'You need to accept our terms' })
        return
      }

      if (!this.vueBind.model.user.phone) {
        this.showError({ message: 'Provide at least a phone number' })
        return
      }

      if (!this.vueBind.model.user.password || !this.vueBind.model.user.password < 0) {
        this.showError({ message: 'Write a password, please.' })
        return
      }

      const countryCode = $('.countries-list').val().substr(1)
      this.showLoader()
      this.vueBind.model.user.phone = countryCode + this.vueBind.model.user.phone
      this.vueBind.model.user.is_account_activated = true
      const userResponse = await this.services.user.create(this.vueBind.model.user)

      this.hideLoader()

      if (!userResponse || !userResponse.success) {
        this.showDefaultError(userResponse)
        return
      }

      await this.showIconPopup({
        icon: '/img/balloons.svg',
        title: 'Thank you!',
        message: 'Your retail will gain the next level and your success will begin shortly.'
      })

      window.location.assign(`/confirm-account?email=${this.vueBind.model.user.email}`)
    }
  }
})
