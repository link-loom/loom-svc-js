var app = new Vue({
  el: '#vue-app',
  data: {
    vueBind: {
      model: {
        notifications: [],
        user: {}
      },
      paths: {},
      visibility: {},
      style: {}
    },
  },
  mounted () {
    window.context = {
      userId: this.$cookies.get('vca_id'),
      token: this.$cookies.get('vca_auth')
    }

    this.initializeView()
  },
  methods: {
    showDefaultError: function (data) {
      if (data && data.message) {
        Swal.fire({
          type: `error`,
          title: `Error`,
          text: `We are very apologize with this situation. Please contact our support team with next error: "${data.message}"`,
          footer: `<a href="/issues#${data.code || '0000'}">Why do I have this issue?</a>`
        })
      } else {
        Swal.fire({
          type: `error`,
          title: `Error`,
          text: `We are very apologize with this situation but something was wrong, please try again in a while time.`,
          footer: `<a href="/issues#${data.code || '0000'}">Why do I have this issue?</a>`
        })
      }
    },
    showError: function (data) {
      if (data && data.message) {
        Swal.fire({
          type: `error`,
          title: `${data.title || 'Error'}`,
          text: `${data.message}`,
          footer: `<a href="/issues#${data.code || '0000'}">Why do I have this issue?</a>`
        })
      } else {
        Swal.fire({
          type: `error`,
          title: `${data.title || 'Error'}`,
          text: `We are very apologize with this situation but something was wrong, please try again in a while time.`,
          footer: `<a href="/issues#${data.code || '0000'}">Why do I have this issue?</a>`
        })
      }
    },
    b64Encode: function (data) {
      return window.btoa(typeof data === 'string' ? data : JSON.stringify(data))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '')
    },
    b64Decode: function (data) {
      return window.atob(typeof data === 'string' ? data : JSON.stringify(data))
    },
    formatPrice (value) {
      if (value) {
        let val = (value / 1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      } else {
        return 0
      }
    },
    initializeView: function () {
      //this.getUser()
    },
    getUser: async function () {
      const userResponse = await this.getUserById()

      if (userResponse && userResponse.success) {
        this.vueBind.model.user = userResponse.result
      }
    },
    getUserById: async function (next) {
      try {
        const userId = this.b64Decode(context.userId)

        if(!userId){
          this.showError({message: 'Please, login again'})
          return
        }

        const result = await this.$http.get(`/api/user/${userId}`, {
          headers: {
            'x-access-token': context.token
          }
        })

        return result.body
      } catch (error) {
        console.error(error)
        return error.body
      }
    },
  }
})
