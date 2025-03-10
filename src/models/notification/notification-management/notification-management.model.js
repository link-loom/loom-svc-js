const { BaseModel, Property } = require('@link-loom/sdk');

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
  date;
  sender_user_id;
  message;
  receiver_user_id;
  subject;
  message_resume;
  business_id;
  folder;

  entityStatuses = {
    read: { id: 3, name: 'read', title: 'Read' },
    unread: { id: 4, name: 'unread', title: 'Unread' },
    deleted: { id: 5, name: 'deleted', title: 'Deleted' },
    ignored: { id: 6, name: 'ignored', title: 'Ignored' },
  };

  static get statuses () {
    return { ...BaseModel.defaultStatuses, ...this.prototype.entityStatuses };
  }

  constructor (args, dependencies) {
    if (!args || !dependencies) {
      throw new Error('Required args and dependencies to build this entity');
    }

    super(dependencies);

    this.initializeBaseProperties(args);
    this.initializeEntityProperties(args);
  }

  initializeEntityProperties (args) {
    this.date = new Property({ value: this.timestamp, type: this.types.timestamp });
    this.sender_user_id = new Property({ value: args.sender_user_id, type: this.types.string });
    this.message = new Property({ value: args.message, type: this.types.string });
    this.receiver_user_id = new Property({
      value: args.receiver_user_id,
      type: this.types.string,
    });
    this.subject = new Property({ value: args.subject, type: this.types.string });
    this.message_resume = new Property({ value: args.message_resume, type: this.types.string });
    this.business_id = new Property({ value: args.business_id, type: this.types.string });
    this.folder = new Property({
      value: args.folder || NotificationManagementModel.folders.inbox,
      type: this.types.object,
    });
  }

  // Return entity sanitized
  get sanitized () {
    return {
      id: this.id?.value,
      status: this.status?.value,
      date: this.date?.value,
      message: this.message?.value,
      receiver_user_id: this.receiver_user_id?.value,
      subject: this.subject?.value,
      message_resume: this.message_resume?.value,
      sender_user_id: this.sender_user_id?.value,
      folder: this.folder?.value,
    };
  }

  get get () {
    return {
      id: this.id?.value,
      created: this.created?.value,
      modified: this.modified?.value,
      deleted: this.deleted?.value,
      status: this.status?.value,
      date: this.date?.value,
      message: this.message?.value,
      receiver: this.receiver?.value,
      subject: this.subject?.value,
      message_resume: this.message_resume?.value,
      sender_user_id: this.sender_user_id?.value,
      folder: this.folder?.value,
    };
  }
}

NotificationManagementModel.folders = {
  inbox: { id: 1, name: 'inbox', title: 'SIDE_INBOX_OPTION', icon: 'mdi-email-outline' },
  sent: { id: 2, name: 'sent', title: 'SIDE_SENT_OPTION', icon: 'mdi-share' },
  junk: { id: 3, name: 'junk', title: 'SIDE_DRAFT_OPTION', icon: 'mdi-file-outline' },
  draft: { id: 4, name: 'draft', title: 'SIDE_TRASH_OPTION', icon: 'mdi-delete' },
};

NotificationManagementModel.channels = {
  stored: { id: 1, name: 'stored', title: 'Stored' },
  push: { id: 2, name: 'push', title: 'Push' },
  email: { id: 3, name: 'email', title: 'Email' },
};

NotificationManagementModel.email_templates = {
  confirmEmail: { id: 1, name: 'confirmEmail', title: 'Confirm email' },
  newsFeed: { id: 2, name: 'newsFeed', title: 'News feed' },
  warning: { id: 3, name: 'warning', title: 'Warning' },
  simple: { id: 4, name: 'simple', title: 'Simple' },
  danger: { id: 5, name: 'danger', title: 'Danger' },
  administrative: { id: 6, name: 'administrative', title: 'Administrative' },
  recoverPassword: { id: 7, name: 'recoverPassword', title: 'recoverPassword' },
};

module.exports = NotificationManagementModel;
