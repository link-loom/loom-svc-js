[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![GitHub license](https://img.shields.io/github/license/thepisode/beat.svg)](https://github.com/thepisode/beat/blob/master/LICENSE) 
[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/beat-cli)

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

# Beat - %BEAT%

Server framework for your Node.js projects made with [Express](https://expressjs.com/), [Firebase](https://firebase.google.com/) and [ReactDOM](https://reactjs.org/docs/react-dom.html) to server rendering.

## Features

* No styling at all, this is a completely bare containing only the essential things you need
* A solid MVC architecture implementation
* Cron functions to execute code in intervals
* Cached functions to save concurrent data, you can upgrade to Redis.
* CLI tool to quicly create new views and API routes.
* ReactDOM to server rendering views with Express.js
* Vue.js to implement in client side
* Strong validations to prevent code-vulnerabilities
* Authentication middlewares
* Cookies management
* Tons of utilities to cypher data, search, handle responses, generate automatic IDs and so on
* Own logs management to handle errors or queue messages
* Possibility to change SQL engine
* Easy-code to newbies devs
* Isolated core code to be upgraded more easily
* It's flexible, implement any architecture, database or change every thing you need.

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

## Create new frontend view

```shell
beat-cli new-view
```

## Create new API controllers

```shell
beat-cli new-api
```

Are you not decided? select an option what you want and follow instructions.

```shell
beat-cli new
```

## Documentation

For all docs you need go to Wiki in this project.

## License

The code is available under the [GNU GENERAL PUBLIC LICENSE](LICENSE).
