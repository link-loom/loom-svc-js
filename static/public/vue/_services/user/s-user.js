// eslint-disable-next-line no-unused-vars
var userService = {
  data: {
    services: {
      user: {}
    }
  },
  mounted () {
    this.services.user = {
      getAll: this.$_getAll_user,
      getByParameters: this.$_getByParameters_user,
      update: this.$_update_user,
      create: this.$_create_user
    }
  },
  methods: {
    async $_getAll_user (data) {
      try {
        const result = await this.$http
          .get('/api/user/',
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
        return error.body
      }
    },
    async $_create_user (data) {
      try {
        if (!data) {
          return null
        }

        const result = await this.$http
          .post('/api/user/create/',
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
    async $_update_user (data) {
      try {
        if (!data) {
          return null
        }

        const result = await this.$http
          .put('/api/user/update/',
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
