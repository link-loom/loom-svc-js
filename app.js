/**
 * Boiler Plate Node.js App
 * 
 * v0.1.0
 */

/**
 * Libraries
 */
const express = require("express");
const app = express();
const path = require('path');
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const open = require('open');
const colors = require('colors/safe');
const cors = require('cors');
const config = require('config');
const firebase = require('firebase-admin');
const request = require('request');

console.log(` Server:  ${config.ServerName}`);
console.log(` version: ${config.ServerVersion}`);
console.log(' ------------------------------------');

var cross = require('./app/controllers/crossController')({ config: config });
cross.SetSettings();

var dependencies = {
	express: express,
	config: config,
	app: app,
	path: path,
	http: http,
	bodyParser: bodyParser,
	firebase: firebase,
	jwt: jwt,
	colors: colors,
	request: request,
	cross: cross,
	root: __dirname,
	isJsonString: (str) => {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}
}

console.log(dependencies.colors.green(' Boilerplate: ') + 'Libs imported');

/**
 * Configuration
 */
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

String.prototype.capitalize = function () {
	return this.replace(/\b\w/g, l => l.toUpperCase());
}

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies
app.use(cors());

/**
 * Initialize all app
 */
const mainServer = require('./app/controllers/mainController')(dependencies);

mainServer.Initialize(() => {
	/**
	 * Launching server
	 */
	//open(`http://localhost:${port}`);
	console.log(`${dependencies.colors.cyan(' Server: ')}http://localhost:${dependencies.config.ServerPort}`)
});

/**
 * Listening on port
 */
app.listen(cross.NormalizePort(process.env.PORT || dependencies.config.ServerPort));
