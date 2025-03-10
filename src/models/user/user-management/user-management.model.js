const { BaseModel, Property } = require('@link-loom/sdk');

/**
 * @swagger
 * components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - phone
 *        properties:
 *          id:
 *            type: string
 *            description: User's id.
 *          national_id:
 *            type: string
 *            description: User's national_id.
 *          email:
 *            type: string
 *            description: User's email.
 *          phone:
 *            type: string
 *            description: User's phone.
 *          password:
 *            type: string
 *            description: User's password.
 *          firstname:
 *            type: string
 *            description: User's firstname.
 *          lastname:
 *            type: string
 *            description: User's lastname.
 *          role:
 *            type: string
 *            description: User's role.
 *          last_login:
 *            type: string
 *            description: User's last_login.
 *          veripass_id:
 *            type: string
 *            description: User's veripass_id.
 *          link_email_activation:
 *            type: string
 *            description: User's link_email_activation.
 *          accept_terms:
 *            type: string
 *            description: User's accept_terms.
 *          is_account_actived:
 *            type: string
 *            description: User's is_account_actived.
 *          business_id:
 *            type: string
 *            description: User's business_id.
 *        example:
 *            id: ""
 *            national_id: "1023925418"
 *            email: jhon.doe@company.com
 *            phone: "573103494807"
 *            password: "secret123"
 *            firstname: "jhon"
 *            lastname: "doe"
 *            role: { id: 3, name: 'employee', title: 'Employee' }
 *            last_login: "1678660540978"
 *            veripass_id: "1678660540900"
 *            link_email_activation: "https://...."
 *            accept_terms: true
 *            is_account_actived: true
 *            business_id: "biz-12345"
 */
class UserManagementModel extends BaseModel {
  national_id;
  email;
  phone;
  password;
  firstname;
  lastname;
  role;
  last_login;
  veripass_id;
  link_email_activation;
  accept_terms;
  is_account_actived;
  business_id;

  entityStatuses = {
    archived: { id: 3, name: 'archived', title: 'Archived' },
    review: { id: 4, name: 'review', title: 'Under Review' },
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
    this.national_id = new Property({
      value: args.national_id,
      type: this.types.string,
    });
    this.email = new Property({ value: args.email, type: this.types.string });
    this.phone = new Property({ value: args.phone, type: this.types.string });
    this.password = new Property({
      value: args.password,
      type: this.types.string,
    });
    this.firstname = new Property({
      value: args.firstname,
      type: this.types.string,
    });
    this.lastname = new Property({
      value: args.lastname,
      type: this.types.string,
    });
    this.role = new Property({
      value: args.role || UserManagementModel.roles.business,
      type: this.types.string,
    });
    this.last_login = new Property({
      value: args.last_login,
      type: this.types.string,
    });
    this.veripass_id = new Property({
      value: args.veripass_id,
      type: this.types.string,
    });
    this.link_email_activation = new Property({
      value: args.link_email_activation,
      type: this.types.string,
    });
    this.accept_terms = new Property({
      value: args.accept_terms,
      type: this.types.boolean,
    });
    this.is_account_actived = new Property({
      value: args.is_account_actived,
      type: this.types.boolean,
    });
    this.business_id = new Property({
      value: args.business_id,
      type: this.types.string,
    });
  }

  // Return entity sanitized
  get sanitized () {
    return {
      id: this.id?.value,
      status: this.status?.value,
      national_id: this.national_id?.value,
      email: this.email?.value,
      phone: this.phone?.value,
      firstname: this.firstname?.value,
      lastname: this.lastname?.value,
      role: this.role?.value,
      is_account_actived: this.is_account_actived?.value,
      veripass_id: this.veripass_id?.value,
      link_email_activation: this.link_email_activation?.value,
      accept_terms: this.accept_terms?.value,
      business_id: this.business_id?.value,
    };
  }

  get get () {
    return {
      id: this.id?.value,
      created: this.created?.value,
      modified: this.modified?.value,
      deleted: this.deleted?.value,
      status: this.status?.value,
      national_id: this.national_id?.value,
      email: this.email?.value,
      phone: this.phone?.value,
      firstname: this.firstname?.value,
      lastname: this.lastname?.value,
      role: this.role?.value,
      is_account_actived: this.is_account_actived?.value,
      veripass_id: this.veripass_id?.value,
      link_email_activation: this.link_email_activation?.value,
      accept_terms: this.accept_terms?.value,
      password: this.password?.value,
      business_id: this.business_id?.value,
    };
  }
}

UserManagementModel.roles = {
  business: { id: 1, name: 'business', title: 'Business' },
  auditor: { id: 2, name: 'auditor', title: 'Auditor' },
  employee: { id: 3, name: 'employee', title: 'Employee' },
  admin: { id: 9999, name: 'admin', title: 'Admin' },
};

module.exports = UserManagementModel;
