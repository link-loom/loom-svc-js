
// eslint-disable-next-line no-unused-vars
var notificationService = {
  data: {
    services: {
      notification: {}
    }
  },
  mounted () {
    this.services.notification = {
      getByParameters: this.$_getByParameters_notification,
      update: this.$_update_notification,
      create: this.$_create_notification
    }
  },
  methods: {
    async $_getByParameters_notification (parameters, query) {
      try {
        let q = ''
        if (!parameters) {
          return null
        }

        if (query) {
          q = `&q=${query}`
        }

        const params = this.objectToQueryString(parameters)

        const result = await this.$http
          .get(`/api/notification${params}${q}`,
            {
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
    async $_create_notification (data) {
      try {
        if (!data) {
          return null
        }

        const result = await this.$http
          .post(window.context.origin + '/api/notification/',
            data,
            {
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
    async $_update_notification (data) {
      try {
        if (!data) {
          return null
        }

        const result = await this.$http
          .patch(window.context.origin + '/api/notification/',
            data,
            {
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
