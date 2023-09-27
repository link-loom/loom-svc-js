const SecurityAuthPasswordService = require('./security/auth-password/auth-password.service');
const RemoteApiService = require('./remote-api/remote-api.service');
const ApiManagerService = require('./api-manager/api-manager.service');
const HealthService = require('./health/health.service');
const UploadService = require('./upload/upload.service');

const DeviceService = require('./device/device-management/device-management.service');
const NotificationService = require('./notification/notification-management/notification-management.service');
const UserService = require('./user/user-management/user-management.service');

const Template = require('./_template/_template.service');

module.exports = {
  SecurityAuthPasswordService,
  RemoteApiService,
  DeviceService,
  NotificationService,
  ApiManagerService,
  HealthService,
  UploadService,
  UserService,
  Template,
};
