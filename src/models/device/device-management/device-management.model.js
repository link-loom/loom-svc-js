const { BaseModel, Property } = require('@link-loom/sdk');

/**
 * @swagger
 * components:
 *   schemas:
 *     Device:
 *      type: object
 *      required:
 *        - user_id
 *        - fingerprint
 *        - operating_system_name
 *        - operating_system_version
 *      properties:
 *        id:
 *          type: string
 *          description: this is the identifier of the entity "Device".
 *        user_id:
 *           type: string
 *           description: this is the user identifier of the entity "Device".
 *        fingerprint:
 *           type: string
 *           description: this is the fingerprint of the entity "Device".
 *        operating_system_name:
 *           type: string
 *           description: this is the operating_system_name of the entity "Device".
 *        operating_system_version:
 *           type: string
 *           description: this is the operating_system_version of the entity "Device".
 *      example:
 *        id: ""
 *        user_id: usr-12345
 *        fingerprint: 1678660540978
 *        operating_system_name: windows
 *        operating_system_version: 11
 */
class DeviceManagementModel extends BaseModel {
  user_id;
  fingerprint;
  operating_system_name;
  operating_system_version;

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
    this.user_id = new Property({ value: args.user_id, type: this.types.string });
    this.fingerprint = new Property({ value: args.fingerprint, type: this.types.string });
    this.operating_system_name = new Property({
      value: args.operating_system_name,
      type: this.types.string,
    });
    this.operating_system_version = new Property({
      value: args.operating_system_version,
      type: this.types.string,
    });
  }

  // Return entity sanitized
  get sanitized () {
    return {
      id: this.id?.value,
      status: this.status?.value,
      user_id: this.user_id?.value,
      fingerprint: this.fingerprint?.value,
      operating_system_name: this.operating_system_name?.value,
      operating_system_version: this.operating_system_version?.value,
    };
  }

  get get () {
    return {
      id: this.id?.value,
      created: this.created?.value,
      modified: this.modified?.value,
      deleted: this.deleted?.value,
      status: this.status?.value,
      user_id: this.user_id?.value,
      fingerprint: this.fingerprint?.value,
      operating_system_name: this.operating_system_name?.value,
      operating_system_version: this.operating_system_version?.value,
    };
  }
}

module.exports = DeviceManagementModel;
