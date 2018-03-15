/**
 * Boiler Plate Node.js App
 * 
 * v0.1.0
 */

const server = require('./src/server/server')({ root: __dirname });
server.start();

var settings = server.settings();
settings.dependencies().add(server, 'server');

/**
 * Initialize all app
 */
const mainServer = require('./src/controllers/mainController')(settings.dependencies().get());

mainServer.Initialize(() => {
	/**
	 * Launching server
	 */
  //open(`http://localhost:${port}`);
  console.log(`${settings.dependencies().get().colors.cyan(' Server: ')}http://localhost:${settings.dependencies().get().config.ServerPort}`);
  console.log(`${settings.dependencies().get().colors.cyan(' Server: ')}${settings.dependencies().get().config.ServerName} v${settings.dependencies().get().config.ServerVersion}`);
  console.log(' ------------------------------------');
});

