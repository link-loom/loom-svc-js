const path = require('path')
const BaseModel = require(path.resolve(path.dirname(require.main.filename), 'src/models/base/base.model'))

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
    this.status = { value: args.status || UserManagementModel.statuses.active, type: this._types.object }

    /* Custom fields */
    this.national_id = { value: args.national_id, type: this._types.string }
    this.email = { value: args.email, type: this._types.string }
    this.phone = { value: args.phone, type: this._types.string }
    this.password = { value: args.password, type: this._types.string }
    this.firstname = { value: args.firstname, type: this._types.string }
    this.lastname = { value: args.lastname, type: this._types.string }
    this.role = { value: args.role || UserManagementModel.roles.business, type: this._types.string }
    this.last_login = { value: args.last_login, type: this._types.string }
    this.veripass_id = { value: args.veripass_id, type: this._types.string }
    this.link_email_activation = { value: args.link_email_activation, type: this._types.string }
    this.accept_terms = { value: args.accept_terms, type: this._types.boolean }
    this.is_account_actived = { value: args.is_account_actived, type: this._types.boolean }
    this.business_id = { value: args.business_id, type: this._types.string }
  }

  // Return entity sanitized
  get sanitized () {
    return {
      id: this.id.value || this.id.type.default,
      status: this.status.value || this.status.type.default,
      national_id: this.national_id.value || this.national_id.type.default,
      email: this.email.value || this.email.type.default,
      phone: this.phone.value || this.phone.type.default,
      firstname: this.firstname.value || this.firstname.type.default,
      lastname: this.lastname.value || this.lastname.type.default,
      role: this.role.value || this.role.type.default,
      is_account_actived: this.is_account_actived.value || this.is_account_actived.type.default,
      veripass_id: this.veripass_id.value || this.veripass_id.type.default,
      link_email_activation: this.link_email_activation.value || this.link_email_activation.type.default,
      accept_terms: this.accept_terms.value || this.accept_terms.type.default,
      business_id: this.business_id.value || this.business_id.type.default
    }
  }

  get get () {
    return {
      id: this.id.value || this.id.type.default,
      date_creation: this.date_creation.value || this.date_creation.type.default,
      last_modification: this.last_modification.value || this.last_modification.type.default,
      last_user_modification: this.last_user_modification.value || this.last_user_modification.type.default,
      status: this.status.value || this.status.type.default,
      national_id: this.national_id.value || this.national_id.type.default,
      email: this.email.value || this.email.type.default,
      phone: this.phone.value || this.phone.type.default,
      firstname: this.firstname.value || this.firstname.type.default,
      lastname: this.lastname.value || this.lastname.type.default,
      role: this.role.value || this.role.type.default,
      is_account_actived: this.is_account_actived.value || this.is_account_actived.type.default,
      veripass_id: this.veripass_id.value || this.veripass_id.type.default,
      link_email_activation: this.link_email_activation.value || this.link_email_activation.type.default,
      accept_terms: this.accept_terms.value || this.accept_terms.type.default,
      password: this.password.value || this.password.type.default,
      business_id: this.business_id.value || this.business_id.type.default
    }
  }
}

UserManagementModel.statuses = {
  inactive: { id: 1, name: 'inactive', title: 'Inactive' },
  active: { id: 2, name: 'active', title: 'Active' },
  deleted: { id: 3, name: 'deleted', title: 'Deleted' },
  blocked: { id: 4, name: 'blocked', title: 'Blocked' }
}

UserManagementModel.roles = {
  business: { id: 1, name: 'business', title: 'Business' },
  auditor: { id: 2, name: 'auditor', title: 'Auditor' },
  employee: { id: 3, name: 'employee', title: 'Employee' },
  admin: { id: 9999, name: 'admin', title: 'Admin' }
}

module.exports = UserManagementModel
