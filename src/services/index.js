const AuthService = require('./auth/auth.service')
const RemoteApiService = require('./remote-api/remote-api.service')
const ApiManagerService = require('./api-manager/api-manager.service')
const HealthService = require('./health/health.service')
const UploadService = require('./upload/upload.service')

const Device = require('./device/device-management/device-management.service')
const Notification = require('./notification/notification-management/notification-management.service')
const User = require('./user/user-management/user-management.service')

const Template = require('./_template/_template.service')

module.exports = {
  AuthService,
  RemoteApiService,
  Device,
  Notification,
  ApiManagerService,
  HealthService,
  UploadService,
  User,
  Template,
}
