/* global Vue, Hammer */
Vue.component('sidepanel', {
  template: `
  <section class="sidepanel-container">
    <div class="sidepanel-overlay"
      v-on:click="emitHidePanel($event)" />
    <section class="sidepanel">
      <header class="d-flex justify-content-between border-bottom p-4">
        <h5 class="text-primary sidepanel-title">{{title}}</h5>
        <button class="close"
          v-on:click="emitHidePanel($event)">
          <span aria-hidden="true">&times;</span>
        </button>
      </header>
      <div class="sidepanel-content p-4">
        <slot name="content"></slot>
      </div>
    </section>
  </section>`,
  data () {
    return {
      result: ''
    }
  },
  props: [
    'showpanel',
    'title',
    'showclose',
    'direction'
  ],
  mounted () {
    this.initializeComponent()
  },
  watch: {
    showpanel: {
      handler: function (newData, oldData) {
        if (newData && newData.state) {
          this.showSidePanel()
        } else {
          this.hideSidePanel()
        }
      },
      deep: true
    }
  },
  methods: {
    initializeComponent () {
      this.settingupDirection()
    },
    settingupDirection () {
      Hammer(document.querySelector('#vue-app .main-panel')).on('swipeleft', () => {
        switch (this.direction) {
          case 'left':
            this.showSidePanel()
            break
          case 'right':
            this.hideSidePanel()
        }
      })

      Hammer(document.querySelector('#vue-app .main-panel')).on('swiperight', () => {
        switch (this.direction) {
          case 'left':
            this.hideSidePanel()
            break
          case 'right':
            this.showSidePanel()
        }
      })
    },
    showSidePanel (event) {
      if (event) { event.preventDefault() }

      document.querySelector('.sidepanel').classList.add('show')
      document.querySelector('.sidepanel-container').classList.add('show')
      document.querySelector('body').classList.add('disable-vertical-scroll')
    },
    hideSidePanel (event) {
      if (event) { event.preventDefault() }

      document.querySelector('body').classList.remove('disable-vertical-scroll')
      document.querySelector('.sidepanel-container').classList.remove('show')
      document.querySelector('.sidepanel').classList.remove('show')
    },
    emitHidePanel (event) {
      if (event) { event.preventDefault() }

      this.$emit('hidepanel', { result: false })
    }
  }
})
