/* global Vue */
Vue.component('mycomponent', {
  template: `
  <section class="mycomponent-container">
  </section>`,
  data () {
    return {
      result: ''
    }
  },
  props: [
    'inputprop'
  ],
  mounted () {
    this.initializeComponent()
  },
  watch: {
    inputprop: function (newData, oldData) {
      // TODO: Do something
    }
  },
  methods: {
    initializeComponent () {
      // TODO: Do something
    },
    emitEvent () {
      this.$emit('onevent', { result: true })
    }
  }
})
