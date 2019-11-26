// eslint-disable-next-line no-unused-vars
var uploadService = {
  data: {
    services: {
      upload: {}
    }
  },
  mounted () {
    this.services.upload = {
      photo: this.$_photo_upload
    }
  },
  methods: {
    async $_photo_upload (data) {
      try {
        if (!data || !data.userId) {
          return null
        }

        const result = await this.$http.get(`/api/TODO/${data.userId}`, {
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
