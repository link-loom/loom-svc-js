// eslint-disable-next-line no-unused-vars
var popup = {
  methods: {
    async showIconPopup (data) {
      if (!data) { data = {} }

      data.title = data.title || 'Unknown message'
      data.message = data.message || 'We are very apologize with this situation but we are trying to complete this action. You can contact us if this message persists'
      data.type = data.type || 'info'
      data.icon = data.icon || '/img/support.svg'
      data.showCancelButton = data.showCancelButton || false
      data.cancelButtonClass = data.cancelButtonClass || 'btn-light'
      data.confirmButtonClass = data.confirmButtonClass || 'btn-primary'
      data.confirmButtonText = data.confirmButtonText || 'Close'
      data.cancelButtonText = data.cancelButtonText || 'Cancel'

      // eslint-disable-next-line
      return new Promise(async (resolve, reject) => {
        document.querySelector('#vue-app').classList.add('blur')
        window.setTimeout(_ => {
          const cancelButton = document.querySelector('.btn-cancelpopup')
          document.querySelector('.swal2-popup').classList.add('swal2-popup-compose')
          document.querySelector('.swal2-header').classList.add('swal2-header-compose')
          document.querySelector('#swal2-content').classList.add('text-left')
          document.querySelector('.btn-confirmpopup').addEventListener('click', _ => {
            window.Swal.getConfirmButton().click()
            document.querySelector('#vue-app').classList.remove('blur')
            resolve({ value: true })
          })

          if (cancelButton) {
            cancelButton.addEventListener('click', _ => {
              window.Swal.getCancelButton().click()
              document.querySelector('#vue-app').classList.remove('blur')
              resolve({ value: false })
            })
          }
        }, 1)

        const response = await window.Swal.fire({
          showConfirmButton: false,
          showCloseButton: true,
          html: `<div class="d-flex app-popup-layout">
                  <div class="col-3 col-xs-1 app-popup-graphic ${data.type}">
                    <div class="d-none d-md-block app-popup-graphic-image" style="background-image: url(${data.icon});"></div>
                  </div>
                  <div class="col-9 col-xs-12 app-popup-content">
                    <div class="app-popup-confirm x-hidden-focus">
                      <div class="app-popup-confirm-content">
                        <h2 class="card-title display-3">${data.title}</h2>
                        <p class="lead mb-5">${data.message}</p>
                        <button class="btn btn-confirmpopup ${data.confirmButtonClass}">${data.confirmButtonText}</button>
                        ${data.showCancelButton ? `<button class="btn btn-cancelpopup ${data.cancelButtonClass}">${data.cancelButtonText}</button>` : ''}
                      </div>
                    </div>
                  </div>
                </div>`
        })

        document.querySelector('#vue-app').classList.remove('blur')
        resolve(response)
      })
    },
    async showPopup (data) {
      if (!data) { data = {} }

      // eslint-disable-next-line
      return new Promise(async (resolve, reject) => {
        document.querySelector('#vue-app').classList.add('blur')
        data.type = data.type || 'info'
        data.title = data.title || 'Unknown message'
        data.message = data.message || 'We are very apologize with this situation but we are trying to complete this action. You can contact us if this message persists'
        data.code = data.code || '0000'
        data.showCancelButton = data.showCancelButton || false
        data.cancelButtonClass = data.cancelButtonClass || 'btn-outline-secondary'
        data.confirmButtonClass = data.confirmButtonClass || 'btn-default'
        data.confirmButtonText = data.confirmButtonText || 'Eliminar'
        data.cancelButtonText = data.cancelButtonText || 'Cancelar'

        const response = await window.Swal.fire({
          showCloseButton: true,
          type: data.type,
          title: data.title,
          text: data.message,
          showCancelButton: data.showCancelButton,
          cancelButtonClass: data.cancelButtonClass,
          confirmButtonClass: data.confirmButtonClass,
          confirmButtonText: data.confirmButtonText,
          cancelButtonText: data.cancelButtonText,
          footer: `<a href="/issues#${data.code}">Why do I have this message?</a>`
        })

        document.querySelector('#vue-app').classList.remove('blur')
        resolve(response)
      })
    },
    showDefaultError (data) {
      if (!data) {
        data = {
          message: null
        }
      }

      // eslint-disable-next-line
      return new Promise(async (resolve, reject) => {
        await this.showIconPopup({
          type: 'info',
          title: 'An error has occurred',
          message: `Please contact technical support with the following message: '${data.message || 'There is no valid error message'}'`,
          code: '0001'
        })
        resolve()
      })
    },
    showError (data) {
      if (!data) { data = {} }

      // eslint-disable-next-line
      return new Promise(async (resolve, reject) => {
        this.showIconPopup({
          type: 'error',
          title: `${data.title || 'Error'}`,
          message: `${data.message || 'An error has occurred'}`,
          code: `${data.code} || '0002'`
        })
        resolve()
      })
    },
    showSuccess (data) {
      if (!data) { data = {} }
      // eslint-disable-next-line
      return new Promise(async (resolve, reject) => {
        document.querySelector('#vue-app').classList.add('blur')
        await window.Swal.fire({
          type: 'success',
          title: data.title || 'Awesome!',
          text: data.message || '',
          confirmButtonClass: 'btn-success',
          confirmButtonText: 'Continue',
          showCloseButton: true
        })
        document.querySelector('#vue-app').classList.remove('blur')
        resolve()
      })
    },
    async showPopupLoader (data) {
      if (!data) { data = {} }

      // eslint-disable-next-line
      return new Promise(async (resolve, reject) => {
        document.querySelector('#vue-app').classList.add('blur')
        await window.Swal.fire({
          title: data.title || 'Uploading file',
          html: data.message || 'Please wait meanwhile your file is uploading',
          allowOutsideClick: false,
          onBeforeOpen: () => {
            window.Swal.showLoading()
          }
        })
        document.querySelector('#vue-app').classList.remove('blur')
        resolve()
      })
    },
    hidePopup () {
      // eslint-disable-next-line
      return new Promise(async (resolve, reject) => {
        window.swal.close()
        document.querySelector('#vue-app').classList.remove('blur')
        resolve()
      })
    }
  }
}
