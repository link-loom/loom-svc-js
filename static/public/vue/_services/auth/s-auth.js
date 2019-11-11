// eslint-disable-next-line no-unused-vars
var authService = {
  data: {
    services: {
      auth: {}
    }
  },
  mounted () {
    this.services.auth = {
      login: this.$_login_auth,
      logout: this.$_logout_auth,
      validateEmail: this.$_validateEmail_auth,
      resendEmail: this.$_resendEmail_auth
    }
  },
  methods: {
    async $_login_auth (data) {
      try {
        if (!data || !data.identity) {
          return null
        }

        const result = await this.$http
          .post('/api/login/',
            data,
            {
              emulateJSON: true,
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
    async $_logout_auth (data) {
      try {
        if (!data) {
          return null
        }

        const result = await this.$http
          .get('/api/logout/',
            data,
            {
              emulateJSON: true,
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
    async $_validateEmail_auth (data) {
      try {
        if (!data) {
          return null
        }

        const result = await this.$http
          .get('/api/validate-email',
            data,
            {
              emulateJSON: true,
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
    async $_resendEmail_auth (data) {
      try {
        if (!data) {
          return null
        }

        const result = await this.$http
          .post('/api/resend-email-validation',
            data,
            {
              emulateJSON: true,
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
