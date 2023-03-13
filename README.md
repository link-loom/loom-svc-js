[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![GitHub license](https://img.shields.io/github/license/thepisode/beat.svg)](https://github.com/thepisode/beat/blob/master/LICENSE) 
[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/beat-cli)

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

# Beat

Another Node.js Server framework to create microservices or huge monoliths.

## Features

* Open Api specification.
* Cron functions to execute code in intervals
* Cached functions to save concurrent data, you can upgrade to Redis.
* CLI tool to quickly create new views and API routes.
* Authentication middlewares.
* Cookies management.
* Tons of utilities to cypher data, search, handle responses, generate automatic IDs and so on.
* Own logs management to handle errors or queue messages.
* Multiple database engine handle, only you need to write your datasource.
* Isolated core code to be upgraded more easily.
* API Rest routes handling.
* Entity models specification.
* Event-driven architecture to communicate another services or frontend clients.

## Create project

Step 1. Install beat-cli to easily manage files and project

```shell
npm install -g beat-cli
```

Step 2. Create a project with cli tool and follow instructions

```shell
beat-cli new-project name-of-project
```

## Install dependencies

Step 1. Install the npm dependencies
```shell
npm install
```

## Configure your environment variables

1. Go to ./config folder
2. Copy template.json file
3. Change new file name to default.json
4. Change all configurations you need

## Run

```shell
npm run
```


## Documentation

### Service docs

#### Playground

Navigate to:

> http://localhost:3601/open-api.playground

**Warning:** If you change your default port, you need to change in the previous route

#### Open Api

> http://localhost:3601/open-api.json

**Warning:** If you change your default port, you need to change in the previous route

#### Framework docs

For all docs you need go to Wiki in this project.

> https://github.com/thEpisode/beat/wiki

## License

The code is available under the [GNU GENERAL PUBLIC LICENSE](LICENSE).
