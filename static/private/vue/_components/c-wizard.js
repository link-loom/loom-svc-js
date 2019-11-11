/* global Vue, popup, b64, format, time, auth, find, localization, loader, parameters
*/
Vue.component('wizard', {
  mixins: [
    popup,
    b64,
    format,
    time,
    auth,
    find,
    localization,
    parameters,
    loader
  ],
  template: `
  <section>
    <div class="wizard-header">
      <h3 class="wizard-title text-center">
        {{config.title}}
      </h3>
      <h5 class="text-center">{{config.subtitle}}</h5>
    </div>
    <div class="wizard-navigation">
      <ul class="d-flex nav p-4">
        <li
          v-for="(_step, _stepIndex) in steps" 
          v-on:click="goToStepHeaderOnClick($event, _stepIndex)" 
          class="flex-fill text-center nav-item wizard-tab-link">
            <a class="nav-link d-flex" href="#details" data-toggle="tab">
              <span class="badge badge-primary">{{ _stepIndex + 1 }}</span>
              <span class="w-100">{{_step.title}}</span>
            </a>
        </li>
      </ul>
      <div class="btn btn-primary moving-tab d-flex">
        <span class="badge badge-light">{{ currentIndex + 1 }}</span>
        <span class="moving-tab-title w-100"></span>
      </div>
    </div>
    <div class="py-4 px-3">
      <slot v-for="(_step, stepIndex) in steps" :name="_step.name" v-if="stepIndex === currentIndex"></slot>
    </div>
    <div class="wizard-footer d-flex justify-content-between">
      <div class="">
        <input 
          v-on:click="previousStepOnClick($event)"
          v-if="currentIndex > 0"
          type="button" class="btn btn-light" name="previous" value="Previous" />
      </div>
      <div class="">
        <input 
          v-if ="this.currentIndex < (this.steps.length - 1)"
          v-on:click="nextStepOnClick($event)"
          type="button" class="btn btn-primary" name="next" value="Next" />
        <input 
          v-if="this.currentIndex === (this.steps.length - 1)"
          v-on:click="finishStepOnClick($event)"
          type="button" class="btn btn-primary" name="finish" value="Finish" />
      </div>
    </div>
  </section>`,

  data () {
    return {
      step: {
        name: '',
        title: '',
        subtitle: ''
      },
      currentIndex: 0
    }
  },
  props: [
    'config',
    'steps',
    'callback'
  ],
  mounted () {
    this.initializeComponent()
  },
  watch: {},
  methods: {
    initializeComponent () {
      this.step = this.steps[0]
      this.currentIndex = 0

      this.setEvents()
      this.setWidthTab()
      this.refreshTitle()
    },
    setEvents () {
      window.addEventListener('resize', _ => {
        this.setWidthTab()
      })
    },
    async previousStepOnClick (event) {
      if (event) { event.preventDefault() }

      const stepResponse = await this.stepEmitter()
      if (stepResponse && stepResponse.continue === false) {
        this.showError(stepResponse)
        return
      }

      if (this.steps && this.currentIndex > 0) {
        this.currentIndex -= 1
        this.step = this.steps[this.currentIndex]

        this.refreshAnimation()
        this.refreshTitle()
      }
    },
    async nextStepOnClick (event) {
      if (event) { event.preventDefault() }
      const stepResponse = await this.stepEmitter()

      if (stepResponse && stepResponse.continue === false) {
        this.showError(stepResponse)
        return
      }

      if (this.steps && this.currentIndex < (this.steps.length - 1)) {
        this.currentIndex += 1
        this.step = this.steps[this.currentIndex]

        this.refreshAnimation()
        this.refreshTitle()
      }
    },
    goToStepHeaderOnClick (event, index) {
      if (event) { event.preventDefault() }

      this.goToStep(index)
    },
    async goToStep (step) {
      const stepResponse = await this.stepEmitter()
      if (stepResponse && stepResponse.continue === false) {
        this.showError(stepResponse)
        return
      }

      this.currentIndex = step
      this.step = this.steps[this.currentIndex]

      this.refreshAnimation()
      this.refreshTitle()
    },
    async finishStepOnClick (event) {
      if (event) { event.preventDefault() }

      const stepResponse = await this.stepEmitter()

      if (stepResponse && stepResponse.continue === false) {
        this.showError(stepResponse)
        return
      }

      this.$emit('finish')
    },
    refreshAnimation () {
      this.setWidthTab()
      const tabContainer = document.querySelector('.wizard-navigation')
      const movingTab = document.querySelector('.moving-tab')
      const tabList = tabContainer.querySelectorAll('.wizard-tab-link')
      const offset = this.currentIndex * (tabContainer.offsetWidth / tabList.length)

      movingTab.style.transform = `translate3d(${offset}px, 0, 0)`
    },
    refreshTitle () {
      setTimeout(_ => {
        document.querySelector('.moving-tab-title').textContent = this.step.title
      }, 150)
    },
    setWidthTab () {
      const movingTab = document.querySelector('.moving-tab')
      const tabWidth = this.getWidthTab(this.currentIndex)

      movingTab.style.width = `${tabWidth}px`
    },
    getWidthTab (index) {
      const tabContainer = document.querySelector('.wizard-navigation')
      const tabList = tabContainer.querySelectorAll('.wizard-tab-link')

      return (tabContainer.offsetWidth / tabList.length) || 0
    },
    stepEmitter () {
      return new Promise((resolve) => {
        this.$emit('stepchanged', {
          index: this.currentIndex,
          step: this.step,
          resolve
        })
      })
    }
  }
})
