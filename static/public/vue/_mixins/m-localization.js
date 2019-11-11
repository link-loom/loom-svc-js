/* global $ */
// eslint-disable-next-line no-unused-vars
var localization = {
  methods: {
    setAllLocalizationLinks () {
      var lang = this.$cookies.get('lang')

      if (!lang) { return }

      $('a').each(function () {
        if ($(this).attr('href')[0] === '/') {
          $(this).attr('href', '/' + lang + $(this).attr('href'))
        }
      })
    },
    langListOnClick (event) {
      if (event) { event.preventDefault() }

      $('.vhq-dropdown-selector-list').toggleClass('vhq-dropdown-selector-open')
    },
    langItemOnClick (event) {
      if (event) { event.preventDefault() }

      this.langListOnClick()

      var lang = event.currentTarget.dataset.lang || 'en'
      var slashCounts = window.location.pathname.split('').filter(function (l) { return l === '/' }).length
      this.$cookies.set('lang', lang, null, '/')

      if (slashCounts > 2) {
        window.location.assign('/' + lang + window.location.pathname.substring(3, window.location.pathname.length))
      } else {
        window.location.assign('/' + lang + '/')
      }
    }
  }
}
