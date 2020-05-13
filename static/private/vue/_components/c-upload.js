/* global Vue, popup, FormData */
Vue.component('upload', {
  template: `
  <div class="custom-file">
    <input ref="uploadFile" v-bind:id="id" type="file" class="form-control custom-file-input" lang="es"
      v-on:change="fileInputOnChange" />
    <label class="custom-file-label" htmlFor="upload-image">{{imagePath}}</label>
  </div>`,
  data () {
    return {
      imagePath: '',
      file: ''
    }
  },
  mixins: [
    popup
  ],
  props: [
    'id'
  ],
  mounted () {
    this.initializeComponent()
  },
  methods: {
    initializeComponent () {
    },
    async uploadFile () {
      this.showPopupLoader()

      const formData = new FormData()
      formData.append('file', this.file)

      let uploadResponse = await this.$http.post(window.context.origin + '/api/upload/', formData)
      uploadResponse = uploadResponse.body || {}
      this.hidePopup()

      if (!uploadResponse || !uploadResponse.success) {
        this.showDefaultError(uploadResponse)
        return
      }

      this.imagePath = uploadResponse.result.Location
      this.$emit('uploaded', { result: this.imagePath })
    },
    fileInputOnChange (event) {
      this.file = event.target.files[0]

      if (!this.file) {
        return
      }

      this.uploadFile()
    }
  }
})
