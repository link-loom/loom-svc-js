// eslint-disable-next-line no-unused-vars
var userService = {
  data: {
    services: {
      user: {}
    }
  },
  mounted () {
    this.services.user = {
      getByParameters: this.$_getByParameters_user,
      update: this.$_update_user,
      create: this.$_create_user
    }
  },
  methods: {
    async $_getByParameters_user (data) {
      try {
        if (!data) {
          return null
        }

        const parameters = this.objectToQueryString(data)

        const result = await this.$http
          .get(`/api/user${parameters}`,
            {
              headers: {
                'x-access-token': window.context.token
              }
            })

        return result.body
      } catch (error) {
        console.error(error)
        if (error.body) {
          return { message: `${error.status} ${error.statusText}: ${error.body}` }
        } else {
          return error
        }
      }
    },
    async $_create_user (data) {
      try {
        if (!data) {
          return null
        }

        const result = await this.$http
          .post('/api/user/',
            data,
            {
              headers: {
                'x-access-token': window.context.token
              }
            })

        return result.body
      } catch (error) {
        console.error(error)
        if (error.body) {
          return { message: `${error.status} ${error.statusText}: ${error.body}` }
        } else {
          return error
        }
      }
    },
    async $_update_user (data) {
      try {
        if (!data) {
          return null
        }

        const result = await this.$http
          .patch('/api/user/',
            data,
            {
              headers: {
                'x-access-token': window.context.token
              }
            })

        return result.body
      } catch (error) {
        console.error(error)
        if (error.body) {
          return { message: `${error.status} ${error.statusText}: ${error.body}` }
        } else {
          return error
        }
      }
    }
  }
}
