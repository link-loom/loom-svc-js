const BaseModel = require('../base/base.model')

class DeviceModel extends BaseModel {
  constructor (args, dependencies) {
    if (!args || !dependencies) {
      throw new Error('Required args to build this entity')
    }

    super(dependencies)
    this.dependencies = dependencies

    const timestamp = (new Date()).getTime() + ''

    /* Base Properties */
    this.last_modification = { value: timestamp, type: dependencies.dal.types.timestamp }
    this.id = { value: args.id, type: dependencies.dal.types.bigserial, isPK: true }
    this.date_creation = { value: timestamp, type: dependencies.dal.types.timestamp }
    this.last_user_modification = { value: args.user_id, type: dependencies.dal.types.object }
    this.status = { value: args.status || DeviceModel.statuses.active, type: dependencies.dal.types.object }

    /* Custom fields */
    this.user_id = { value: args.user_id, type: dependencies.dal.types.string }
    this.push_token = { value: args.push_token, type: dependencies.dal.types.string }
    this.fingerprint = { value: args.fingerprint, type: dependencies.dal.types.string }
    this.operating_system_name = { value: args.operating_system_name, type: dependencies.dal.types.string }
    this.operating_system_version = { value: args.operating_system_version, type: dependencies.dal.types.string }
  }

  // Return entity sanitized
  get sanitized () {
    return {
      id: this.id.value || this.id.type.default,
      status: this.status.value || this.status.type.default,
      user_id: this.user_id.value || this.user_id.type.default,
      push_token: this.push_token.value || this.push_token.type.default,
      fingerprint: this.fingerprint.value || this.fingerprint.type.default,
      operating_system_name: this.operating_system_name.value || this.operating_system_name.type.default,
      operating_system_version: this.operating_system_version.value || this.operating_system_version.type.default
    }
  }

  get get () {
    return {
      id: this.id.value || this.id.type.default,
      date_creation: this.date_creation.value || this.date_creation.type.default,
      last_modification: this.last_modification.value || this.last_modification.type.default,
      last_user_modification: this.last_user_modification.value || this.last_user_modification.type.default,
      status: this.status.value || this.status.type.default,
      user_id: this.user_id.value || this.user_id.type.default,
      push_token: this.push_token.value || this.push_token.type.default,
      fingerprint: this.fingerprint.value || this.fingerprint.type.default,
      operating_system_name: this.operating_system_name.value || this.operating_system_name.type.default,
      operating_system_version: this.operating_system_version.value || this.operating_system_version.type.default
    }
  }
}

DeviceModel.statuses = {
  inactive: { id: 1, name: 'inactive', title: 'Inactive' },
  active: { id: 2, name: 'active', title: 'Active' },
  deleted: { id: 3, name: 'deleted', title: 'Deleted' },
  blocked: { id: 4, name: 'blocked', title: 'Blocked' }
}

module.exports = DeviceModel
