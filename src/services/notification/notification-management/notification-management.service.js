const fs = require('fs');

class NotificationService {
  constructor (dependencies) {
    /* Base Properties */
    this._dependencies = dependencies;
    this._database = this._dependencies?.database?.default?.adapter;
    this._models = dependencies.models;
    this._utilities = dependencies.utilities;
    this._console = this._dependencies.console;
    this._services = this._dependencies.services;

    /* Custom Properties */
    this._tableName = 'notifications';
    this._nodemailer = dependencies.nodemailer;
    this._unfluff = dependencies.unfluff;
    this._pushNotification = dependencies.pushNotificationManager;

    /* Assigments */
  }

  async create ({ params }) {
    try {
      if (!params) {
        return this._utilities.io.response.error(
          'Data provided not match with any registered user',
        );
      }

      if (!params.channels) {
        params.channels = this._models.NotificationManagementModel.channels.stored;
      }

      if (
        params.channels.includes(
          this._models.NotificationManagementModel.channels.stored.name,
        )
      ) {
        await this.#channelStored(params);
      }

      if (
        params.channels.includes(
          this._models.NotificationManagementModel.channels.push.name,
        )
      ) {
        await this.#channelEventBus(params);
      }

      if (
        params.channels.includes(
          this._models.NotificationManagementModel.channels.email.name,
        )
      ) {
        await this.#channelEmail(params);
      }

      return this._utilities.io.response.success();
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async update ({ params }) {
    try {
      if (!params || !params.id) {
        return this._utilities.io.response.error('Please provide an id');
      }

      const transactionResponse = await this._database.update({
        tableName: this._tableName,
        entity: params,
      });

      if (!transactionResponse) {
        this._console.error(transactionResponse);
        return this._utilities.io.response.error();
      }

      return this._utilities.io.response.success(transactionResponse);
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async get ({ params }) {
    try {
      if (!params || !params.queryselector) {
        return this._utilities.io.response.error(
          'Please provide a queryselector',
        );
      }

      let response = {};

      switch (params.queryselector) {
        case 'id':
          response = await this.#getById({ params });
          break;
        case 'receiver':
          response = await this.#getByReceiverUserId({ params });
          break;
        case 'business-id':
          response = await this.#getByOrganizationId({ params });
          break;
        default:
          response = this._utilities.io.response.error(
            'Provide a valid slug to query',
          );
          break;
      }

      return response;
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async #channelStored (params) {
    try {
      if (!params || !params.message || !params.receiver_user_id) {
        this._console.error('message or receiver not providen');
        return this._utilities.io.response.error(
          'Please provide at minimum a message and a receiver',
        );
      }

      this.#formatCreateEntity(params);

      const entity = new this._models.NotificationManagementModel(
        params,
        this._dependencies,
      );
      const transactionResponse = await this._database.create({
        tableName: this._tableName,
        entity: entity.get,
      });

      if (!transactionResponse) {
        this._console.error(transactionResponse);
        return this._utilities.io.response.error();
      }

      return this._utilities.io.response.success(entity.get);
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async #channelEventBus (params) {
    try {
      /* TODO: Implement the communication with event bus */
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async #channelEmail (params) {
    try {
      let emailPath = this._dependencies.root;
      let emailtemplate = '';
      const transporter = this._nodemailer.createTransport({
        host: this._dependencies?.config?.modules?.email?.SETTINGS.HOST,
        port: this._dependencies?.config?.modules?.email?.SETTINGS.PORT,
        secure: this._dependencies?.config?.modules?.email?.SETTINGS.SECURE,
        auth: {
          user: this._dependencies?.config?.modules?.email?.SETTINGS.USER,
          pass: this._dependencies?.config?.modules?.email?.SETTINGS.PASSWORD,
        },
      });
      const mailOptions = {
        from: '',
        to: params.to,
        subject: '',
        text: '',
        html: '',
      };

      // Select what email type is needed
      switch (params.email.template.name) {
        case this._models.NotificationManagementModel.email_templates.confirmEmail
          .name:
          emailPath += '/src/static/email/confirm-eng.html';
          mailOptions.from =
            this._dependencies?.config?.modules?.email?.actions.validateEmail.from;
          mailOptions.subject = `${params.email.subject || 'Welcome to %LOOM%'}`;
          emailtemplate = await this.readFileAsync(emailPath);
          emailtemplate = emailtemplate.replaceAll(
            'OPEN_ACCOUNT_LINK',
            `${params.email.mainActionLink}`,
          );
          break;
        case this._models.NotificationManagementModel.email_templates.recoverPassword
          .name:
          emailPath += '/src/static/email/recover-esp.html';
          mailOptions.from =
            this._dependencies?.config?.modules?.email?.actions?.recoverPassword?.from;
          mailOptions.subject = `${params.email.subject || 'Email recover'}`;
          emailtemplate = await this.readFileAsync(emailPath);
          emailtemplate = emailtemplate.replaceAll(
            'RECOVER_PASSWORD_LINK',
            `${params.email.mainActionLink}`,
          );
          break;
        case this._models.NotificationManagementModel.email_templates.newsFeed.name:
          break;
        case this._models.NotificationManagementModel.email_templates.warning.name:
          break;
        case this._models.NotificationManagementModel.email_templates.simple.name:
          break;
        case this._models.NotificationManagementModel.email_templates.danger.name:
          break;
        case this._models.NotificationManagementModel.email_templates.administrative
          .name:
          break;
        default:
          break;
      }

      // Setting up the email
      mailOptions.html = emailtemplate;

      const result = await this.sendEmailAsync(transporter, mailOptions);

      return this._utilities.io.response.success(result);
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async readFileAsync (path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, 'utf8', (err, emailTemplate) => {
        if (err) {
          this._console.log(err);
          reject(err);
        } else {
          resolve(emailTemplate);
        }
      });
    }).catch((err) => {
      throw err;
    });
  }

  async sendEmailAsync (transporter, mailOptions) {
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          this._console.log(error);
          reject(error);
        } else {
          resolve(info);
        }
      });
    }).catch((err) => {
      throw err;
    });
  }

  async #getByFilters (params) {
    try {
      if (!params || !params.filters) {
        return this._utilities.io.response.error(
          'Please provide at least one filter',
        );
      }

      const response = this._database.getByFilters({
        tableName: this._tableName,
        filters: params.filters,
      });

      return this._utilities.io.response.success(response);
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async #getById ({ params }) {
    try {
      if (!params || !params.search) {
        return this._utilities.io.response.error(
          'Please provide query to search',
        );
      }

      return this.#getByFilters({
        filters: [{ key: 'id', operator: '==', value: params.search }],
      });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async #getByReceiverUserId ({ params }) {
    try {
      if (!params || !params.search) {
        return this._utilities.io.response.error(
          'Please provide query to search',
        );
      }

      return this.#getByFilters({
        filters: [
          { key: 'receiver_user_id', operator: '==', value: params.search },
        ],
      });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  async #getByOrganizationId ({ params }) {
    try {
      if (!params || !params.search) {
        return this._utilities.io.response.error(
          'Please provide query to search',
        );
      }

      return this.#getByFilters({
        filters: [{ key: 'organization_id', operator: '==', value: params.search }],
      });
    } catch (error) {
      this._console.error(error);
      return this._utilities.io.response.error();
    }
  }

  #formatCreateEntity (params) {
    const messageResume = this._unfluff.fromString(
      params.message.substring(0, 50) || '',
    );

    params.id = this._utilities.generator.id({ length: 20, prefix: 'not-' });
    params.message_resume = messageResume;
  }

  get status () {
    return this._models.NotificationManagementModel.statuses;
  }

  get roleType () {
    return this._models.NotificationManagementModel.role_types;
  }

  get channels () {
    return this._models.NotificationManagementModel.channels;
  }

  get emailTemplate () {
    return this._models.NotificationManagementModel.email_templates;
  }
}

module.exports = NotificationService;
