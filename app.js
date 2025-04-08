/**
 * Main start
 *
 * To read documentation go to https://github.com/link-loom/loom-svc-js/wiki
 */

const { Loom } = require('@link-loom/sdk');
const server = new Loom({ root: __dirname });

const main = async () => {
  const namespace = '[Server]';
  const dependencies = await server.ignite();

  // Launching server
  dependencies.console.info(
    `http://localhost:${dependencies?.config?.server?.port}/`,
    { namespace },
  );
  dependencies.console.info(
    `http://localhost:${dependencies?.config?.server?.port}/open-api.playground`,
    { namespace },
  );
  dependencies.console.info(
    `http://localhost:${dependencies?.config?.server?.port}/open-api.json`,
    { namespace },
  );
  dependencies.console.info(
    `${dependencies?.config?.server?.name} v${dependencies?.config?.server?.version}`,
    { namespace },
  );
  dependencies.console.log(' ------------------------------------');
};

main();
