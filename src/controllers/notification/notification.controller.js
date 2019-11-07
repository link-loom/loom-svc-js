function notificationController (dependencies) {
  const fs = require('fs')
  const _db = dependencies.db
  const _console = dependencies.console
  const _firebase = dependencies.firebaseManager
  const _utilities = dependencies.utilities
  const _nodemailer = dependencies.nodemailer
  const _unfluff = dependencies.unfluff
  const _models = dependencies.models

  const get = async () => {
    try {
      // Get values from reference as snapshot
      const docRef = _db.collection('notifications')
      const docRaw = await docRef.get()
      // Cast Firebase object into an arry of users
      const entityResponse = _firebase.cast.array(docRaw)
      const entityCleaned = _utilities.response.clean(entityResponse)

      return _utilities.response.success(entityCleaned.data)
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const getById = async (data) => {
    try {
      if (!data || !data.id) {
        return _utilities.response.error('Please provide an id')
      }

      // Get values from reference as snapshot
      const docRef = _db.collection('notifications').doc(`${data.id}`)
      const docRaw = await docRef.get()
      // Cast Firebase object into an arry of users
      const entityResponse = _firebase.cast.object(docRaw)

      // Check if exist any data
      if (!docRaw || !docRaw.exists || !entityResponse) {
        return _utilities.response.error('No notification found')
      }

      return _utilities.response.success(_utilities.response.clean(entityResponse))
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const getAllByReceiver = async (data) => {
    try {
      if (!data || !data.receiver) {
        return _utilities.response.error('Please provide a receiver')
      }

      // Get values from reference as snapshot
      const docRef = _db.collection('notifications')
        .where('receiver', '==', `${data.receiver}`)
      const docRaw = await docRef.get()
      // Cast Firebase object into an arry of users
      const entityResponse = _firebase.cast.array(docRaw)

      return _utilities.response.success(entityResponse.data)
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const getAllLastByReceiver = async (data) => {
    try {
      const notificationsResponse = await getAllByReceiver(data)

      if (!_utilities.response.isValid(notificationsResponse)) {
        return notificationsResponse
      }

      const notifications = _utilities.response.clean(notificationsResponse.result) || []

      if (notifications.length > 5) {
        const result = notifications.split(notifications.length - 5, notifications.length)
        return _utilities.response.success(result)
      }

      return _utilities.response.success(notifications)
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const getAllGroupedByFoldersAndByReceiver = async (data) => {
    try {
      const notificationsResponse = await getAllByReceiver(data)

      if (!_utilities.response.isValid(notificationsResponse)) {
        return notificationsResponse
      }

      const notifications = _utilities.response.clean(notificationsResponse.result) || []
      const notificationFolders = JSON.parse(JSON.stringify(_models.Notification.folders))

      // Filtering notifications by folders
      for (const notificationCategoryKey in notificationFolders) {
        if (Object.prototype.hasOwnProperty.call(notificationFolders, notificationCategoryKey)) {
          const notificationCategory = notificationFolders[notificationCategoryKey]
          notificationCategory.notifications = []

          notificationCategory.notifications = notifications.filter(notification => {
            if (notification.folder) {
              return notification.folder.name.toLocaleLowerCase() === notificationCategory.name.toLocaleLowerCase()
            }

            return false
          })
        }
      }

      return _utilities.response.success(notificationFolders)
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const create = async (data) => {
    try {
      if (!data) {
        return _utilities.response.error('Data provided not match with any registered user')
      }
      if (!data.notification_type) { data.notification_type = _models.Notification.notification_types.stored }
      if (data.notification_type === _models.Notification.notification_types.allBasics) {
        await sendStored(data)
        await sendPush(data)
        await sendEmail(data)
      } else {
        if (data.notification_type === _models.Notification.notification_types.stored) {
          await sendStored(data)
        }
        if (data.notification_type === _models.Notification.notification_types.push) {
          await sendPush(data)
        }
        if (data.notification_type === _models.Notification.notification_types.email) {
          await sendEmail(data)
        }
      }
      return _utilities.response.success()
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const update = async (data) => {
    try {
      if (!data || !data.id) {
        return _utilities.response.error('Please provide an id')
      }
      const entityResponse = await getById(data)

      if (!_utilities.response.isValid(entityResponse)) {
        return entityResponse
      }

      const docRef = _db.collection('notifications').doc(data.id)
      const entity = new _models.Notification({ ...entityResponse.result, ...data }, dependencies)
      const docResponse = await docRef.update(entity.get)

      if (!docResponse) {
        _console.error(docResponse)
        return _utilities.response.error()
      }

      return _utilities.response.success(data)
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const sendStored = async (data) => {
    try {
      if (!data || !data.message || !data.receiver) {
        _console.error('message or receiver not providen')
        return _utilities.response.error('Please provide at minimum a message and a receiver')
      }

      data.id = _utilities.idGenerator(20, 'not-')

      const messageResume = _unfluff.fromString((data.message.substring(0, 50) || ''))
      data.message_resume = messageResume

      const docRef = _db.collection('notifications').doc(data.id)
      const entity = new _models.Notification(data, dependencies)
      const docResponse = await docRef.set(entity.get)

      if (!docResponse) {
        _console.error(docResponse)
        return _utilities.response.error()
      }

      return _utilities.response.success(entity.sanitized)
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const sendPush = async (data) => {

  }

  const sendEmail = async (data) => {
    try {
      let emailPath = dependencies.root
      let emailtemplate = ''
      const transporter = _nodemailer.createTransport({
        host: dependencies.config.MAIL.HOST,
        port: dependencies.config.MAIL.PORT,
        secure: dependencies.config.MAIL.SECURE,
        auth: {
          user: dependencies.config.MAIL.USER,
          pass: dependencies.config.MAIL.PASSWORD
        }
      })
      const mailOptions = {
        from: dependencies.config.MAIL.FROM,
        to: data.to,
        subject: '',
        text: '',
        html: ''
      }

      // Select what email type is needed
      switch (data.email.template.name) {
        case _models.Notification.email_templates.confirmEmail.name:
          emailPath += '/static/public/email/confirm-eng.html'
          mailOptions.subject = `${data.email.subject || 'Welcome to Go Bot'}`
          emailtemplate = await readFileAsync(emailPath)
          emailtemplate = emailtemplate.replaceAll('OPEN_ACCOUNT_LINK', `${data.email.mainActionLink}`)
          break
        case _models.Notification.email_templates.newsFeed.name:
          break
        case _models.Notification.email_templates.warning.name:
          break
        case _models.Notification.email_templates.simple.name:
          break
        case _models.Notification.email_templates.danger.name:
          break
        case _models.Notification.email_templates.administrative.name:
          break
        default:
          break
      }

      // Setting up the email
      mailOptions.html = emailtemplate

      const result = await sendEmailAsync(transporter, mailOptions)

      return _utilities.response.success(result)
    } catch (error) {
      _console.error(error)
      return _utilities.response.error()
    }
  }

  const readFileAsync = async (path) => {
    const promise = await new Promise((resolve, reject) => {
      fs.readFile(path, 'utf8', function (err, emailTemplate) {
        if (err) {
          _console.log(err)
          reject(err)
        } else {
          resolve(emailTemplate)
        }
      })
    })
      .catch(err => { throw err })

    return promise
  }

  const sendEmailAsync = async (transporter, mailOptions) => {
    const promise = await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          _console.log(error)
          reject(error)
        } else {
          resolve(info)
        }
      })
    })
      .catch(err => { throw err })

    return promise
  }

  return {
    getAll: get,
    getById,
    create,
    update,
    getAllByReceiver,
    getAllLastByReceiver,
    getAllGroupedByFoldersAndByReceiver,
    status: _models.Notification.statuses,
    role_type: _models.Notification.role_types,
    notification_type: _models.Notification.notification_types,
    email_template: _models.Notification.email_templates
  }
}

module.exports = notificationController
