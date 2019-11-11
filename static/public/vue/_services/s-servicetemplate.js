// eslint-disable-next-line no-unused-vars
var entityService = {
  data: {
    services: {
      entity: {}
    }
  },
  mounted () {
    this.services.entity = {
      foo: this.$_foo_entity
    }
  },
  methods: {
    async $_foo_entity (data) {
      try {
        if (!data || !data.userId) {
          return null
        }

        const result = await this.$http.get(`/api/fooEntity/getByIdentity/${data.userId}`, {
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
