const baseModel = require('../base/base.model')

class UserModel extends baseModel {
  constructor (args, dependencies) {
    if (!args || !dependencies) {
      throw new Error('Required args to build this entity')
    }

    super(dependencies)
    this.dependencies = dependencies

    /* const { name, level } = args */
    const timestamp = (new Date()).getTime() + ''

    /* Base */
    this.last_modification = { value: timestamp, type: dependencies.dal.types.timestamp }
    this.id = { value: args.id, type: dependencies.dal.types.bigserial, isPK: true }
    this.date_creation = { value: timestamp, type: dependencies.dal.types.timestamp }
    this.last_user_modification = { value: args.user_id, type: dependencies.dal.types.object }
    this.status = { value: args.status || UserModel.statuses.active, type: dependencies.dal.types.object }

    /* Custom fields */
    this.dni = { value: args.dni, type: dependencies.dal.types.string }
    this.email = { value: args.email, type: dependencies.dal.types.string }
    this.phone = { value: args.phone, type: dependencies.dal.types.string }
    this.password = { value: args.password, type: dependencies.dal.types.string }
    this.firstname = { value: args.firstname, type: dependencies.dal.types.string }
    this.lastname = { value: args.lastname, type: dependencies.dal.types.string }
    this.role = { value: args.role || UserModel.roles.business, type: dependencies.dal.types.string }
    this.last_login = { value: args.last_login, type: dependencies.dal.types.string }
    this.last_time_on_app = { value: args.last_time_on_app, type: dependencies.dal.types.string }
    this.is_vca_completed = { value: args.is_vca_completed, type: dependencies.dal.types.boolean }
    this.vca_account = { value: args.vca_account, type: dependencies.dal.types.string }
    this.link_email_activation = { value: args.link_email_activation, type: dependencies.dal.types.string }
    this.accept_terms = { value: args.accept_terms, type: dependencies.dal.types.boolean }
    this.is_account_actived = { value: args.is_account_actived, type: dependencies.dal.types.boolean }
    this.business_id = { value: args.business_id, type: dependencies.dal.types.string }
  }

  // Return entity sanitized
  get sanitized () {
    return {
      id: this.id.value || this.id.type.default,
      status: this.status.value || this.status.type.default,
      dni: this.dni.value || this.dni.type.default,
      email: this.email.value || this.email.type.default,
      phone: this.phone.value || this.phone.type.default,
      firstname: this.firstname.value || this.firstname.type.default,
      lastname: this.lastname.value || this.lastname.type.default,
      role: this.role.value || this.role.type.default,
      is_account_actived: this.is_account_actived.value || this.is_account_actived.type.default,
      is_vca_completed: this.is_vca_completed.value || this.is_vca_completed.type.default,
      vca_account: this.vca_account.value || this.vca_account.type.default,
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
      dni: this.dni.value || this.dni.type.default,
      email: this.email.value || this.email.type.default,
      phone: this.phone.value || this.phone.type.default,
      firstname: this.firstname.value || this.firstname.type.default,
      lastname: this.lastname.value || this.lastname.type.default,
      role: this.role.value || this.role.type.default,
      is_account_actived: this.is_account_actived.value || this.is_account_actived.type.default,
      is_vca_completed: this.is_vca_completed.value || this.is_vca_completed.type.default,
      vca_account: this.vca_account.value || this.vca_account.type.default,
      link_email_activation: this.link_email_activation.value || this.link_email_activation.type.default,
      accept_terms: this.accept_terms.value || this.accept_terms.type.default,
      password: this.password.value || this.password.type.default,
      business_id: this.business_id.value || this.business_id.type.default
    }
  }
}

UserModel.statuses = {
  inactive: { id: 1, name: 'inactive', title: 'Inactive' },
  active: { id: 2, name: 'active', title: 'Active' },
  deleted: { id: 3, name: 'deleted', title: 'Deleted' },
  blocked: { id: 4, name: 'blocked', title: 'Blocked' }
}

UserModel.roles = {
  business: { id: 1, name: 'business', title: 'Business' },
  auditor: { id: 2, name: 'auditor', title: 'Auditor' },
  admin: { id: 9999, name: 'admin', title: 'Admin' }
}

module.exports = UserModel
