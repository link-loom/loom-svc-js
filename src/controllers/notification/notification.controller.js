const fs = require('fs')

class NotificationController {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies
    this._db = dependencies.db
    this._models = dependencies.models
    this._utilities = dependencies.utilities
    this._console = this._dependencies.console
    this._controllers = this._dependencies.controllers

    /* Custom Properties */
    this._nodemailer = dependencies.nodemailer
    this._unfluff = dependencies.unfluff
    this._pushNotification = dependencies.pushNotificationManager

    /* Assigments */
    this._tableName = 'notifications'
  }

  async getByFilters (data) {
    try {
      if (!data || !data.filters) {
        return this._utilities.response.error('Please provide at least one filter')
      }

      const response = this._db.transaction.getByFilters({
        tableName: this._tableName,
        filters
      })

      return this._utilities.response.success(response)
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async create (data) {
    try {
      if (!data) {
        return this._utilities.response.error('Data provided not match with any registered user')
      }

      if (!data.channels) { data.channels = this._models.Notification.channels.stored }

      if (data.channels.includes(this._models.Notification.channels.stored.name)) {
        await this.#channelStored(data)
      }

      if (data.channels.includes(this._models.Notification.channels.push.name)) {
        await this.#channelEventBus(data)
      }

      if (data.channels.includes(this._models.Notification.channels.email.name)) {
        await this.#channelEmail(data)
      }

      return this._utilities.response.success()
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async update (data) {
    try {
      if (!data || !data.id) {
        return this._utilities.response.error('Please provide an id')
      }
      const entityResponse = await this.getById(data)

      if (!this._utilities.response.isValid(entityResponse)) {
        return entityResponse
      }

      const entity = new this._models.Notification({ ...entityResponse.result, ...data }, this._dependencies)
      const transactionResponse = await this._db.transaction.update({
        tableName: this._tableName,
        entity: entity.get
      })

      if (!transactionResponse) {
        this._console.error(transactionResponse)
        return this._utilities.response.error()
      }

      return this._utilities.response.success(entity.get)
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async #channelStored (data) {
    try {
      if (!data || !data.message || !data.receiver) {
        this._console.error('message or receiver not providen')
        return this._utilities.response.error('Please provide at minimum a message and a receiver')
      }

      data.id = this._utilities.idGenerator(20, 'not-')

      const messageResume = this._unfluff.fromString((data.message.substring(0, 50) || ''))
      data.message_resume = messageResume

      const entity = new this._models.Notification(data, this.dependencies)
      const entityResponse = await this._db.transaction.create({
        tableName: this._tableName,
        entity: entity.get
      })

      if (!entityResponse) {
        this._console.error(entityResponse)
        return this._utilities.response.error()
      }

      return this._utilities.response.success(entity.sanitized)
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async #channelEventBus (data) {
    try {
      /* TODO: Implement the communication with event bus */
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async #channelEmail (data) {
    try {
      let emailPath = this.dependencies.root
      let emailtemplate = ''
      const transporter = this._nodemailer.createTransport({
        host: this.dependencies.config.MAIL.HOST,
        port: this.dependencies.config.MAIL.PORT,
        secure: this.dependencies.config.MAIL.SECURE,
        auth: {
          user: this.dependencies.config.MAIL.USER,
          pass: this.dependencies.config.MAIL.PASSWORD
        }
      })
      const mailOptions = {
        from: this.dependencies.config.MAIL.FROM,
        to: data.to,
        subject: '',
        text: '',
        html: ''
      }

      // Select what email type is needed
      switch (data.email.template.name) {
        case this._models.Notification.email_templates.confirmEmail.name:
          emailPath += '/static/public/email/confirm-eng.html'
          mailOptions.subject = `${data.email.subject || 'Welcome to Go Bot'}`
          emailtemplate = await this.readFileAsync(emailPath)
          emailtemplate = emailtemplate.replaceAll('OPEN_ACCOUNT_LINK', `${data.email.mainActionLink}`)
          break
        case this._models.Notification.email_templates.newsFeed.name:
          break
        case this._models.Notification.email_templates.warning.name:
          break
        case this._models.Notification.email_templates.simple.name:
          break
        case this._models.Notification.email_templates.danger.name:
          break
        case this._models.Notification.email_templates.administrative.name:
          break
        default:
          break
      }

      // Setting up the email
      mailOptions.html = emailtemplate

      const result = await this.sendEmailAsync(transporter, mailOptions)

      return this._utilities.response.success(result)
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async readFileAsync (path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, 'utf8', function (err, emailTemplate) {
        if (err) {
          this._console.log(err)
          reject(err)
        } else {
          resolve(emailTemplate)
        }
      })
    }).catch(err => { throw err })
  }

  async sendEmailAsync (transporter, mailOptions) {
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          this._console.log(error)
          reject(error)
        } else {
          resolve(info)
        }
      })
    }).catch(err => { throw err })
  }

  get status () {
    return this._models.Notification.statuses
  }

  get roleType () {
    return this._models.Notification.role_types
  }

  get channels () {
    return this._models.Notification.channels
  }

  get emailTemplate () {
    return this._models.Notification.email_templates
  }
}

module.exports = NotificationController
