class ConsoleManager {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies

    /* Custom Properties */
    this._colors = dependencies.colors

    /* Assigments */
    this._namespace = '[Server]::[Console]::[Manager]'
  }

  setup () {
    this.success('Loading', { namespace: this._namespace })

    this.success('Loaded', { namespace: this._namespace })
  }

  code (body, args = {}) {
    const { title, namespace } = args

    if (typeof body === 'string') {
      console.log(this._colors.grey(' > ') + (body.isJson() === true ? JSON.stringify(body) : body))
      return
    }

    if (title) {
      console.log(this._colors.grey((title || namespace || '') + ' > '), body)
    } else {
      console.log(this._colors.grey(' > '), body)
    }

  }

  log (body, args = {}) {
    const { title, namespace } = args

    if (typeof body === 'string') {
      console.log(body.isJson() === true ? JSON.stringify(body) : body)
      return
    }

    if (title) {
      console.log((title || namespace || ''), body)
    } else {
      console.log(body)
    }
  }

  error (body, args = {}) {
    const { title, namespace } = args

    console.log(` ${this._colors.red(`${(title || namespace || '')}[ERROR]`)}: `, body)
  }

  info (body, args = {}) {
    const { title, namespace } = args

    console.log(` ${this._colors.cyan((title || namespace || ''))}: `, body)
  }

  warning (body, args = {}) {
    const { title, namespace } = args

    console.log(` ${this._colors.yellow((title || namespace || ''))}: `, body)
  }

  success (body, args = {}) {
    const { title, namespace } = args

    console.log(` ${this._colors.green((title || namespace || ''))}: `, body)
  }
}

module.exports = { ConsoleManager }
