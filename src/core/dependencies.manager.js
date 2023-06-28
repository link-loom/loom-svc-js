class DependenciesManager {
  constructor (args) {
    /* Base Properties */
    this._args = args

    /* Custom Properties */
    this._dependencies = this._args

    /* Assigments */
    this._namespace = '[Server]::[Dependencies]::[Manager]'
  }

  setup () {
    this.loadDependencies()
  }

  loadDependencies () {
    console.log(` ${this._namespace}: Loading`)

    const root = this._args.root
    const http = require('http')
    const events = require('events')
    const expressModule = require('express')
    const express = expressModule()
    const httpServer = http.createServer(express)
    const socketModule = require('socket.io')
    const websocketClientModule = require('socket.io-client')
    const multerModule = require('multer')

    this._dependencies = {
      root,
      http,
      multerModule,
      express,
      events,
      httpServer,
      socketModule,
      websocketClientModule,
      expressModule,
      aesjs: require('aes-js'),
      cors: require('cors'),
      path: require('path'),
      moment: require('moment'),
      crypto: require('crypto'),
      config: require('config'),
      helmet: require('helmet'),
      bcrypt: require('bcryptjs'),
      request: require('axios'),
      jwt: require('jsonwebtoken'),
      colors: require('colors/safe'),
      compress: require('compression'),
      nodemailer: require('nodemailer'),
      bodyParser: require('body-parser'),
      cookieParser: require('cookie-parser'),
      exceljs: require('exceljs'),
      swaggerJsdoc: require('swagger-jsdoc'),
      swaggerUi: require('swagger-ui-express')
    }

    this.#importCustomDependencies()

    console.log(` ${this._dependencies.colors.green(this._namespace)}: Loaded`)
  }

  #importCustomDependencies () {
    const dependencies = this._dependencies.config.CUSTOM_DEPENDENCIES

    if (!dependencies || !dependencies.length) {
      return
    }

    console.log(` ${this._dependencies.colors.green(this._namespace)}: Loading custom dependencies`)
    dependencies.map(customDependency => {
      console.log(` ${this._dependencies.colors.cyan(this._namespace)}: Loading ${customDependency.name} dependency`)
      this._dependencies[customDependency.name] = require(customDependency.package)
      return customDependency
    })
    console.log(` ${this._dependencies.colors.green(this._namespace)}: Loaded custom dependencies`)
  }

  getDependencies () {
    return this._dependencies
  }

  addCustomDependency (dependency, name) {
    this._dependencies[name] = dependency
  }

  get get () {
    return this.getDependencies
  }

  get core () {
    return {
      add: this.addCustomDependency.bind(this),
      get: this.getDependencies.bind(this)
    }
  }
}

module.exports = { DependenciesManager }
