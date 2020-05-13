// eslint-disable-next-line no-unused-vars
var entityService = {
  data: {
    services: {
      entity: {}
    }
  },
  mounted () {
    this.services.entity = {
      getByParameters: this.$_getByParameters_entity,
      update: this.$_update_entity,
      create: this.$_create_entity
    }
  },
  methods: {
    async $_getByParameters_entity (data) {
      try {
        if (!data) {
          return null
        }

        const parameters = this.objectToQueryString(data)

        const result = await this.$http
          .get(`${window.context.origin}/api/entity${parameters}`,
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
    async $_create_entity (data) {
      try {
        if (!data) {
          return null
        }

        const result = await this.$http
          .post(window.context.origin + '/api/entity/',
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
    async $_update_entity (data) {
      try {
        if (!data) {
          return null
        }

        const result = await this.$http
          .put(window.context.origin + '/api/entity/',
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
