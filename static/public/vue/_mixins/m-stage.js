// eslint-disable-next-line no-unused-vars
var stage = {
  created () {
    this.evaluateBackendUri()
  },
  methods: {
    async evaluateBackendUri () {
      const backendUriResponse = await this.getBackendUri()

      if (!backendUriResponse || !backendUriResponse.success) {
        window.context.origin = '/'
      }

      window.context.origin = backendUriResponse.result
    },
    async getBackendUri () {
      try {
        const result = await this.$http
          .get('/api/services/backend-uri')

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
