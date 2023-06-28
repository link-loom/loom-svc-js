const path = require('path')
const BaseModel = require(path.resolve(path.dirname(require.main.filename), 'src/models/base/base.model'))

/**
 * @swagger
 * components:
 *   schemas:
 *     Device:
 *      type: object
 *      required:
 *        - user_id
 *        - fingerprint
 *      properties:
 *        id:
 *          type: string
 *          description: Device's id
 *        user_id:
 *           type: string
 *           description: Device's user_id.
 *        fingerprint:
 *           type: string
 *           description: Device's fingerprint.
 *        operating_system_name:
 *           type: string
 *           description: Device's operating_system_name.
 *        operating_system_version:
 *           type: string
 *           description: Device's operating_system_version.
 *      example:
 *        id: ""
 *        user_id: usr-12345
 *        fingerprint: 1678660540978
 *        operating_system_name: windows
 *        operating_system_version: 11
 */
class DeviceManagementModel extends BaseModel {
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
    this.status = { value: args.status || DeviceManagementModel.statuses.active, type: this._types.object }

    /* Custom fields */
    this.user_id = { value: args.user_id, type: this._types.string }
    this.fingerprint = { value: args.fingerprint, type: this._types.string }
    this.operating_system_name = { value: args.operating_system_name, type: this._types.string }
    this.operating_system_version = { value: args.operating_system_version, type: this._types.string }
  }

  // Return entity sanitized
  get sanitized () {
    return {
      id: this.id.value || this.id.type.default,
      status: this.status.value || this.status.type.default,
      user_id: this.user_id.value || this.user_id.type.default,
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
      fingerprint: this.fingerprint.value || this.fingerprint.type.default,
      operating_system_name: this.operating_system_name.value || this.operating_system_name.type.default,
      operating_system_version: this.operating_system_version.value || this.operating_system_version.type.default
    }
  }
}

DeviceManagementModel.statuses = {
  inactive: { id: 1, name: 'inactive', title: 'Inactive' },
  active: { id: 2, name: 'active', title: 'Active' },
  deleted: { id: 3, name: 'deleted', title: 'Deleted' },
  blocked: { id: 4, name: 'blocked', title: 'Blocked' }
}

module.exports = DeviceManagementModel
