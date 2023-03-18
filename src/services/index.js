const AuthService = require('./auth/auth.service')
const RemoteApiService = require('./remote-api/remote-api.service')
const DeviceService = require('./device/device.service')
const NotificationService = require('./notification/notification.service')
const ApiManagerService = require('./api-manager/api-manager.service')
const StatusService = require('./status/status.service')
const TemplateService = require('./_template/_template.service')
const UploadService = require('./upload/upload.service')
const UserService = require('./user/user.service')

module.exports = {
  AuthService,
  RemoteApiService,
  DeviceService,
  NotificationService,
  ApiManagerService,
  StatusService,
  TemplateService,
  UploadService,
  UserService
}
