/* global FormData */
// eslint-disable-next-line no-unused-vars
var uploadService = {
  data: {
    services: {
      upload: {}
    }
  },
  mounted () {
    this.services.upload = {
      file: this.$_file_upload,
      bulk: this.$_bulk_upload
    }
  },
  methods: {
    async $_file_upload (data) {
      try {
        if (!data) {
          return null
        }

        const formData = new FormData()
        formData.append('file', data.file)
        formData.append('route', data.route)
        formData.append('handler', data.handler)
        formData.append('payload', JSON.stringify(data.payload || {}))

        const result = await this.$http
          .post('/api/upload/file',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                'x-access-token': window.context.token
              }
            })

        return result.body
      } catch (error) {
        console.error(error)
        return error.body
      }
    },
    async $_bulk_upload (data) {
      try {
        if (!data) {
          return null
        }

        const formData = new FormData()
        formData.append('file', data.file)
        formData.append('route', data.route)
        formData.append('handler', data.handler)

        const result = await this.$http
          .post('/api/upload/bulk',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
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
