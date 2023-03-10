const AuthController = require('./auth/auth.controller')
const BackendController = require('./backend/backend.controller')
const DeviceController = require('./device/device.controller')
const NotificationController = require('./notification/notification.controller')
const ServicesController = require('./services/services.controller')
const StatusController = require('./status/status.controller')
const TemplateController = require('./_template/_template.controller')
const UploadController = require('./upload/upload.controller')
const UserController = require('./user/user.controller')

module.exports = {
  AuthController,
  BackendController,
  DeviceController,
  NotificationController,
  ServicesController,
  StatusController,
  TemplateController,
  UploadController,
  UserController
}
