const path = require('path')
const BaseModel = require(path.resolve(path.dirname(require.main.filename), 'src/models/base/base.model'))

/**
 * @swagger
 * components:
 *    schemas:
 *      Notification:
 *        type: object
 *        required:
 *          - sender_user_id
 *          - message
 *          - receiver_user_id
 *        properties:
 *          id:
 *            type: string
 *            description: Notification's id
 *          date:
 *            type: string
 *            description: Notification's date.
 *          sender_user_id:
 *            type: string
 *            description: Notification's sender_user_id.
 *          message:
 *            type: string
 *            description: Notification's message.
 *          receiver_user_id:
 *            type: string
 *            description: Notification's receiver_user_id.
 *          subject:
 *            type: string
 *            description: Notification's subject.
 *          message_resume:
 *            type: string
 *            description: Notification's message_resume.
 *          business_id:
 *            type: string
 *            description: Notification's business_id.
 *          folder:
 *            type: object
 *            description: Notification's folder.
 *        example:
 *          id: ""
 *          date: "1678660540978"
 *          sender_user_id: "usr-12345"
 *          message: "Hello world! I'm from space"
 *          receiver_user_id: "usr-67890"
 *          subject: "Hello"
 *          message_resume: "Hello world! ..."
 *          business_id: "biz-1234"
 *          folder: { id: 1, name: 'inbox', title: 'SIDE_INBOX_OPTION', icon: 'mdi-email-outline' }
 */
class NotificationManagementModel extends BaseModel {
  constructor (args, dependencies) {
    if (!args || !dependencies) {
      throw new Error('Required args to build this entity')
    }

    super(dependencies)

    /* Base Properties */
    this._dependencies = dependencies
    this._utilities = this._dependencies.utilities
    this._dataTypesManager = this._dependencies.DataTypesManager

    /* Custom Properties */
    this._types = this._dataTypesManager.types

    /* Assigments */
    const timestamp = this._utilities.generator.time.timestamp()

    /* Base Properties */
    this.last_modification = { value: timestamp, type: this._types.timestamp }
    this.id = { value: args.id, type: this._types.bigserial, isPK: true }
    this.date_creation = { value: timestamp, type: this._types.timestamp }
    this.last_user_modification = { value: args.user_id, type: this._types.object }
    this.status = { value: args.status || NotificationManagementModel.statuses.active, type: this._types.object }

    /* Custom fields */
    this.date = { value: timestamp, type: this._types.timestamp }
    this.sender_user_id = { value: args.sender_user_id, type: this._types.string }
    this.message = { value: args.message, type: this._types.string }
    this.receiver_user_id = { value: args.receiver_user_id, type: this._types.string }
    this.subject = { value: args.subject, type: this._types.string }
    this.message_resume = { value: args.message_resume, type: this._types.string }
    this.business_id = { value: args.business_id, type: this._types.string }
    this.folder = { value: args.folder || NotificationManagementModel.folders.inbox, type: this._types.object }
  }

  // Return entity sanitized
  get sanitized () {
    return {
      id: this.id.value || this.id.type.default,
      status: this.status.value || this.status.type.default,
      date: this.date.value || this.date.type.default,
      message: this.message.value || this.message.type.default,
      receiver_user_id: this.receiver_user_id.value || this.receiver_user_id.type.default,
      subject: this.subject.value || this.subject.type.default,
      message_resume: this.message_resume.value || this.message_resume.type.default,
      sender_user_id: this.sender_user_id.value || this.sender_user_id.type.default,
      folder: this.folder.value || this.folder.type.default
    }
  }

  get get () {
    return {
      id: this.id.value || this.id.type.default,
      date_creation: this.date_creation.value || this.date_creation.type.default,
      last_modification: this.last_modification.value || this.last_modification.type.default,
      last_user_modification: this.last_user_modification.value || this.last_user_modification.type.default,
      status: this.status.value || this.status.type.default,
      date: this.date.value || this.date.type.default,
      message: this.message.value || this.message.type.default,
      receiver: this.receiver.value || this.receiver.type.default,
      subject: this.subject.value || this.subject.type.default,
      message_resume: this.message_resume.value || this.message_resume.type.default,
      sender_user_id: this.sender_user_id.value || this.sender_user_id.type.default,
      folder: this.folder.value || this.folder.type.default
    }
  }
}

NotificationManagementModel.folders = {
  inbox: { id: 1, name: 'inbox', title: 'SIDE_INBOX_OPTION', icon: 'mdi-email-outline' },
  sent: { id: 2, name: 'sent', title: 'SIDE_SENT_OPTION', icon: 'mdi-share' },
  junk: { id: 3, name: 'junk', title: 'SIDE_DRAFT_OPTION', icon: 'mdi-file-outline' },
  draft: { id: 4, name: 'draft', title: 'SIDE_TRASH_OPTION', icon: 'mdi-delete' }
}

NotificationManagementModel.statuses = {
  read: { id: 1, name: 'read', title: 'Read' },
  unread: { id: 2, name: 'unread', title: 'Unread' },
  deleted: { id: 3, name: 'deleted', title: 'Deleted' },
  ignored: { id: 4, name: 'ignored', title: 'Ignored' }
}

NotificationManagementModel.channels = {
  stored: { id: 1, name: 'stored', title: 'Stored' },
  push: { id: 2, name: 'push', title: 'Push' },
  email: { id: 3, name: 'email', title: 'Email' }
}

NotificationManagementModel.email_templates = {
  confirmEmail: { id: 1, name: 'confirmEmail', title: 'Confirm email' },
  newsFeed: { id: 2, name: 'newsFeed', title: 'News feed' },
  warning: { id: 3, name: 'warning', title: 'Warning' },
  simple: { id: 4, name: 'simple', title: 'Simple' },
  danger: { id: 5, name: 'danger', title: 'Danger' },
  administrative: { id: 6, name: 'administrative', title: 'Administrative' }
}

module.exports = NotificationManagementModel
