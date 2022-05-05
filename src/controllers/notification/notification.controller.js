const fs = require('fs')

class NotificationController {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies
    this._db = dependencies.db
    this._models = dependencies.models
    this._utilities = dependencies.utilities
    this._console = this._dependencies.console
    this._firebase = dependencies.firebaseManager
    this._controllers = this._dependencies.controllers

    /* Custom Properties */
    this._nodemailer = dependencies.nodemailer
    this._unfluff = dependencies.unfluff
    this._pushNotification = dependencies.pushNotificationManager

    /* Assigments */
    /* this._newPrivateObject = new SomeObject(this._dependencies) */
  }

  async get () {
    try {
      // Get values from reference as snapshot
      const docRef = this._db.collection('notifications')
      const docRaw = await docRef.get()
      // Cast Firebase object into an arry of users
      const entityResponse = this._firebase.cast.array(docRaw)
      const entityCleaned = this._utilities.response.clean(entityResponse)

      return this._utilities.response.success(entityCleaned.data)
    } catch (error) {
      this.this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async getById (data) {
    try {
      if (!data || !data.id) {
        return this._utilities.response.error('Please provide an id')
      }

      // Get values from reference as snapshot
      const docRef = this._db.collection('notifications').doc(`${data.id}`)
      const docRaw = await docRef.get()
      // Cast Firebase object into an arry of users
      const entityResponse = this._firebase.cast.object(docRaw)

      // Check if exist any data
      if (!docRaw || !docRaw.exists || !entityResponse) {
        return this._utilities.response.error('No notification found')
      }

      return this._utilities.response.success(this._utilities.response.clean(entityResponse))
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async getAllByReceiver (data) {
    try {
      if (!data || !data.receiverUserId) {
        return this._utilities.response.error('Please provide a receiver')
      }

      // Get values from reference as snapshot
      const docRef = this._db.collection('notifications')
        .where('receiver_user_id', '==', `${data.receiverUserId}`)
      const docRaw = await docRef.get()
      // Cast Firebase object into an arry of users
      const entityResponse = this._firebase.cast.array(docRaw)

      return this._utilities.response.success(entityResponse.data)
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async getAllLastByReceiver (data) {
    try {
      const notificationsResponse = await this.getAllByReceiver(data)

      if (!this._utilities.response.isValid(notificationsResponse)) {
        return notificationsResponse
      }

      const notifications = this._utilities.response.clean(notificationsResponse.result) || []

      if (notifications.length > 5) {
        const result = notifications.split(notifications.length - 5, notifications.length)
        return this._utilities.response.success(result)
      }

      return this._utilities.response.success(notifications)
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
      if (!data.notification_type) { data.notification_type = this._models.Notification.notification_types.stored }
      if (data.notification_type === this._models.Notification.notification_types.allBasics.name) {
        await this.sendStored(data)
        await this.sendPush(data)
        await this.sendEmail(data)
      } else {
        if (data.notification_type === this._models.Notification.notification_types.stored.name) {
          await this.sendStored(data)
        }
        if (data.notification_type === this._models.Notification.notification_types.push.name) {
          await this.sendPush(data)
        }
        if (data.notification_type === this._models.Notification.notification_types.email.name) {
          await this.sendEmail(data)
        }
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

      const docRef = this._db.collection('notifications').doc(data.id)
      const entity = new this._models.Notification({ ...entityResponse.result, ...data }, this._dependencies)
      const docResponse = await docRef.update(entity.get)

      if (!docResponse) {
        this._console.error(docResponse)
        return this._utilities.response.error()
      }

      return this._utilities.response.success(data)
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async sendStored (data) {
    try {
      if (!data || !data.message || !data.receiver) {
        this._console.error('message or receiver not providen')
        return this._utilities.response.error('Please provide at minimum a message and a receiver')
      }

      data.id = this._utilities.idGenerator(20, 'not-')

      const messageResume = this._unfluff.fromString((data.message.substring(0, 50) || ''))
      data.message_resume = messageResume

      const docRef = this._db.collection('notifications').doc(data.id)
      const entity = new this._models.Notification(data, this.dependencies)
      const docResponse = await docRef.set(entity.get)

      if (!docResponse) {
        this._console.error(docResponse)
        return this._utilities.response.error()
      }

      return this._utilities.response.success(entity.sanitized)
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async sendPush (data) {
    try {
      switch (data.push_type) {
        case 'all_push_token':
          return this.sendPushToAllTokenDevicesAsync(data)
        case 'all_push_topic':
          return this.sendPushToTopicAsync(data)
        case 'single_push_token':
          return this.sendSingleDeviceAsync(data)
        default:
          data.topic = 'everybody'
          return this.sendPushToTopicAsync(data)
      }
    } catch (error) {
      this._console.error(error)
      return this._utilities.response.error()
    }
  }

  async sendSingleDeviceAsync (data) {
    const deviceController = new this._controllers.DeviceController(this._dependencies)
    const result = await deviceController.getByIdentity(data)
    if (!this._utilities.response.isValid(result)) {
      return result
    }

    data.device = result.response
    return this.sendPushToTokenDeviceAsync(data)
  }

  async sendPushToAllTokenDevicesAsync (data) {
    const deviceController = new this._controllers.DeviceController(this._dependencies)
    const response = await deviceController.getAll()

    if (!this._utilities.response.isValid(response)) {
      return response
    }

    for (const device of response.result) {
      data.device = device
      this.sendPushToTokenDeviceAsync(data)
    }

    return this._utilities.response.success(response)
  }

  async sendPushToTopicAsync (data) {
    return this._pushNotification.send({
      notification: {
        title: data.subject,
        body: data.message
      },
      android: {
        notification: {
          icon: data.icon || '',
          color: data.color || '',
          imageUrl: data.image,
          clickAction: data.android_intent
        }
      },
      apns: {
        notification: {
        },
        payload: {
          aps: data.payload,
          clickAction: data.aps_intent
        },
        fcm_options: {
          image: data.image
        }
      },
      webpush: {
        headers: {
          image: data.image
        },
        data: {
          clickAction: data.webpush_action
        }
      },
      topic: data.topic
    })
  }

  async sendPushToTokenDeviceAsync (data) {
    return this._pushNotification.send({
      notification: {
        title: data.subject,
        body: data.message
      },
      android: {
        notification: {
          icon: data.icon || '',
          color: data.color || '#000000',
          imageUrl: data.image || '',
          clickAction: data.android_intent || ''
        }
      },
      apns: {
        payload: {
          aps: data.payload || {},
          clickAction: data.aps_intent || ''
        },
        fcm_options: {
          image: data.image || ''
        }
      },
      webpush: {
        headers: {
          image: data.image || ''
        },
        data: {
          clickAction: data.webpush_action || '#'
        }
      },
      token: data.device.push_token || ''
    })
  }

  async sendEmail (data) {
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

  get notificationType () {
    return this._models.Notification.notification_types
  }

  get emailTemplate () {
    return this._models.Notification.email_templates
  }
}

module.exports = NotificationController
