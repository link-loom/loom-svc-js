/* global $ */
// eslint-disable-next-line no-unused-vars
var loader = {
  methods: {
    showLoader: () => {
      $('.loader').addClass('show')
    },
    hideLoader: (data) => {
      $('.loader').removeClass('show')

      if (data && data.hideMenu) {
        setTimeout(() => {
          $('body').addClass('sidebar-icon-only')
        }, 1000)
      }
    }
  }
}
