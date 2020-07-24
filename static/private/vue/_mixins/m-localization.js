// eslint-disable-next-line no-unused-vars
var localization = {
  created: function () {
    this.setAllLocalizationLinks()
  },
  methods: {
    setAllLocalizationLinks () {
      const lang = this.$cookies.get('lang')

      if (!lang) { return }

      const aTags = document.querySelectorAll('a[translate]')

      for (const aTag of aTags) {
        if (aTag.pathname === '/') {
          aTag.pathname += 'index'
        }

        aTag.href = aTag.origin + '/' + lang + aTag.pathname
      }
    },
    langItemOnClick (event) {
      if (event) { event.preventDefault() }

      var lang = event.currentTarget.dataset.lang || 'en'
      var slashCounts = window.location.pathname.split('').filter(function (l) { return l === '/' }).length
      this.$cookies.set('lang', lang, null, '/')

      if (slashCounts > 2) {
        window.location.assign('/' + lang + window.location.pathname.substring(3, window.location.pathname.length))
      } else {
        window.location.assign('/' + lang + '/index')
      }
    }
  }
}
