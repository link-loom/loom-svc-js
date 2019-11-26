// eslint-disable-next-line no-unused-vars
var localeService = {
  data: {
    services: {
      locale: {}
    }
  },
  mounted () {
    this.services.locale = {
      getAllIDDCountries: this.$_getAllIDDCountries_locale,
      getLocale: this.$_getLocale_locale,
      getAllLocales: this.$_getAll_locale
    }
  },
  methods: {
    async $_getAllIDDCountries_locale (data) {
      try {
        const result = await this.$http.get('/api/locale/get-idd-countries/', {
          headers: {
            'x-access-token': window.context.token
          }
        })

        return result.body
      } catch (error) {
        console.error(error)
        return error.body
      }
    },
    async $_getLocale_locale (data) {
      try {
        if (!data || !data.name || !data.handler || !data.lang) {
          return null
        }

        const result = await this.$http
          .get(`/api/locale/get-locale?name=${data.name}&handler=${data.handler}&lang=${data.lang}`, {
            headers: {
              'x-access-token': window.context.token
            }
          })

        return result.body
      } catch (error) {
        console.error(error)
        return error.body
      }
    },
    async $_getAll_locale (data) {
      try {
        const result = await this.$http
          .get('/api/locale/', {
            headers: {
              'x-access-token': window.context.token
            }
          })

        return result.body
      } catch (error) {
        console.error(error)
        return error.body
      }
    }
  }
}
