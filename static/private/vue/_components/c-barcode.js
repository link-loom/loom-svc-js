/* global Vue, ZXing */
Vue.component('barcode', {
  template: `
  <section class="barcode-container">
    <div class="barcode-overlay"
      v-on:click="closeOnClick($event)"></div>

    <section class="barcode-elements d-flex flex-column justify-content-center p-4">
      <button type="button" class="close barcode-close" aria-label="Close"
        v-on:click="closeOnClick($event)">
        <span aria-hidden="true">&times;</span>
      </button>
      <div class="d-flex justify-content-center my-3">
        <button class="btn btn-warning mr-2" id="start-button"
          v-on:click="startOnClick($event)">Start</button>
        <button class="btn btn-outline-secondary ml-2" id="reset-button"
          v-on:click="resetOnClick($event)">Reset</button>
      </div>
      <div class="d-flex justify-content-center">
        <video id="barcode-preview" class="barcode-preview border"></video>
      </div>
      
      <article id="source-panel" class="d-flex flex-column justify-content-center my-3">
        <label for="video-source-list">Change video source:</label>
        <select id="video-source-list" class="form-control">
        </select>
      </article>

      <div class="d-flex justify-content-center my-3">
        <label class="mr-2">Result:</label>
        <span id="barcode-result">{{result}}</span>
      </div>
    </section>
  </section>`,
  data () {
    return {
      startReadingTrigger: false,
      result: '',
      codeReader: {},
      selectedDeviceId: ''
    }
  },
  props: [
    'startreading',
    'targetuid'
  ],
  mounted () {
    this.initializeComponent()
  },
  watch: {
    startreading: function (newData, oldData) {
      this.startReadingTrigger = newData
      if (!this.startReadingTrigger) {
        document.querySelector('.barcode-container').classList.remove('show')
        return
      }

      this.initializeZxing(this.startReadingTrigger)
    }
  },
  methods: {
    initializeComponent () {
    },
    startOnClick (event) {
      if (event) { event.preventDefault() }

      this.codeReader.decodeFromVideoDevice(this.selectedDeviceId, 'barcode-preview', (result, err) => {
        if (err && !(err instanceof ZXing.NotFoundException)) {
          console.error(err)
          this.result = err
          return
        }
        // result = { text: 'mi limo' }
        if (!result || !result.text) {
          return
        }

        console.log(result)
        this.result = result.text
        this.$emit('scanned-code', { result: this.result, target: this.targetuid || '' })
        this.closeOnClick(null)
      })
    },
    resetOnClick (event) {
      if (event) { event.preventDefault() }

      this.codeReader.reset()
      this.result = ''
    },
    getVideoDevices () {
      return this.codeReader.getVideoInputDevices()
    },
    async initializeZxing (canStart) {
      document.querySelector('.barcode-container').classList.add('show')

      try {
        const sourceSelect = document.getElementById('video-source-list')
        this.selectedDeviceId = null
        this.codeReader = new ZXing.BrowserMultiFormatReader()
        this.videoInputDevices = await this.getVideoDevices()

        for (let i = 0; i < sourceSelect.length; i++) {
          sourceSelect.remove(i)
        }

        if (this.videoInputDevices.length <= 0) {
          this.result = 'You do not have any camera devices available'
          return
        }

        this.selectedDeviceId = this.videoInputDevices[0].deviceId
        this.videoInputDevices.forEach((element) => {
          const sourceOption = document.createElement('option')
          sourceOption.text = element.label
          sourceOption.value = element.deviceId
          sourceSelect.appendChild(sourceOption)
        })

        sourceSelect.onchange = () => {
          this.selectedDeviceId = sourceSelect.value
        }

        const sourceSelectPanel = document.getElementById('source-panel')
        sourceSelectPanel.style.display = 'block'
      } catch (error) {
        console.error(error)
      }
    },
    async closeOnClick (event) {
      if (event) { event.preventDefault() }

      this.resetOnClick(null)
      this.$emit('scanned-finished', { result: true })
    }
  }
})
