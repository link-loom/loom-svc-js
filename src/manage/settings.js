function settings (args) {
  const dependenciesManager = require('./dependencies')(args);

  const setup = () => {
    globalDependencies();
    languageExtensions();
    setupMiddlewares();
  }

  const globalDependencies = () => {
    const utilities = require('./utilities')({ dependencies: dependenciesManager.get() });
    dependenciesManager.add(utilities, 'utilities');

    dependenciesManager.add((str) => {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    }, 'isJsonString');
  }

  const languageExtensions = () => {
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

    console.log(dependenciesManager.get().colors.green(' Boilerplate: ') + 'Language extended');
  }

  const setupMiddlewares = () => {
    // use body parser so we can get info from POST and/or URL parameters
    dependenciesManager.get().httpServer.use(dependenciesManager.get().bodyParser.urlencoded({ extended: true })); // support encoded bodies
    dependenciesManager.get().httpServer.use(dependenciesManager.get().bodyParser.json()); // support json encoded bodies
    dependenciesManager.get().httpServer.use(dependenciesManager.get().cors());

    console.log(dependenciesManager.get().colors.green(' Boilerplate: ') + 'Configured middlewares');
  }

  const getDependenciesManager = () => {
    return dependenciesManager;
  }

  return {
    initialize: setup,
    dependencies: getDependenciesManager,
  }
}

module.exports = settings;
