function dependencies (args) {
  var _dependencies

  const setup = () => {
    _dependencies = {}

    instantiateDependencies()
  }

  const instantiateDependencies = () => {
    const root = args.root
    const http = require('http')
    const events = require('events')
    const expressModule = require('express')
    const express = expressModule()
    const httpServer = http.createServer(express)
    const socketModule = require('socket.io')
    const eventBus = new events.EventEmitter()
    const multerConstructor = require('multer')
    const multer = multerConstructor({
      storage: multerConstructor.memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
      }
    })

    _dependencies = {
      root,
      http,
      multer,
      express,
      eventBus,
      httpServer,
      socketModule,
      expressModule,
      cors: require('cors'),
      path: require('path'),
      aesjs: require('aes-js'),
      moment: require('moment'),
      crypto: require('crypto'),
      config: require('config'),
      helmet: require('helmet'),
      maxmind: require('maxmind'),
      bcrypt: require('bcryptjs'),
      request: require('request'),
      jwt: require('jsonwebtoken'),
      colors: require('colors/safe'),
      compress: require('compression'),
      unfluff: require('html-to-text'),
      nodemailer: require('nodemailer'),
      bodyParser: require('body-parser'),
      firebase: require('firebase-admin'),
      cookieParser: require('cookie-parser'),
      exceljs: require('exceljs'),
      googleStorage: require('@google-cloud/storage')
    }
    console.log(` ${_dependencies.colors.green(`${_dependencies.config.SERVER_NAME}:`)} Dependencies imported`)
  }

  const getDependencies = () => {
    return _dependencies
  }

  const addCustomDependency = (dependency, name) => {
    _dependencies[name] = dependency
  }

  setup()
  return {
    get: getDependencies,
    add: addCustomDependency
  }
}

module.exports = dependencies