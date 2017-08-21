# resir014-screeps

> Smart colony management for the game [Screeps](https://screeps.com/). Written in [TypeScript](http://www.typescriptlang.org/).

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Table of Contents

* [Design Principles](#design-principles)
* [Quick Start](#quick-start)
* [Configuration](#configuration)
* [Testing](#testing)
* [Notes](#notes)
* [To-Do](#to-do)

## Design Principles

### Maintainability

The codebase has to be simple and easily readable in order for the code to be easily built upon. In this case, the code quality is kept to a high standard and every part of the Stonehenge codebase is painstakingly documented to improve the readability and maintainability.

### Modularity

The code is structured by modules, which means expanding on the codebase could be done with minimal overhead.

### Configuration over Convention

Anyone who wants to build their Screeps colony with with Stonehenge must not be forced to follow conventions beyond the initial setup. The configurations available in the `config/` folder will allow you to fine-tune the codebase according to your workflow and needs.

## Quick Start

### Requirements

* [Node.js](https://nodejs.org/en/) (latest LTS is recommended)
* [Typings](https://github.com/typings/typings)
* [Yarn](https://yarnpkg.com/en/) - Optional. You can use `npm` if you don't want to, but this is for your own sanity.

### Install all required modules!

Run the following the command to install the required packages and TypeScript declaration files if you are using yarn:

```bash
$ yarn
```

or, for npm:

```bash
$ npm install
```
### Configure Screeps credentials

Create a copy of `config/credentials.example.json` and rename it to `config/credentials.json`.

**WARNING:** _**DO NOT** commit this file into your repository!_

```bash
# config/credentials.json
$ cp config/credentials.example.json config/credentials.json
```

In the newly created `credentials.json` file, change the `email` and `password` properties with your Screeps credentials.  The `serverPassword`, `token`, and `gzip` options are only for private servers that support them.  If you are uploading to the public Screeps server, you should delete these fields from your credentials file.

See [Configuration](#configuration) for more in-depth info on configuration options.

### Run the compiler

```bash
# To compile and upload your TypeScript files on the fly in "watch mode":
$ npm start

# To compile and deploy once:
$ npm run deploy
```

### Pre-deploy steps

If you just installed this code for the first time, it is **very important** that you perform the following tasks first!

* Delete your currently active code. (This stops the game until you push the new code.)
* Delete ALL currently active memory entries. (This will remove any memory conflicts.)
* Kill ALL of your creeps.

You can also perform the above tasks to clean up your memory should things go wrong.

### Post-deploy steps

After deploying, you should manually set the build priorities for your rooms. Go to your respective room's memory in the memory tree, go to `jobs`, and set the number of creeps you'd like each role.

## Configuration

This project is configured in two places. `config/` is for deployment configuration, and contains your screeps login credentials along with other options.
`src/config/` contains a file you can use to configure your runtime Screeps code.

### Runtime config

You can use the configuration variables in `src/config` by importing the file:

```js
import * as Config from "../path/to/config";
```

... and simply calling the config variables with `Config.CONFIG_VARIABLE` in your code.  This file mostly servers as an example for making configurable code.

_**NOTE**: You may want to consider adding this file to `.gitignore` if you end up storing confidential information there._

### Deployment / Compiling configuration

The files under `config/`, as well as `webpack.config.ts` are where deployment configuration options are set.

It's helpful to remember that the config is just a javascript object, and can be passed around and modifide using [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain).


#### Environment:

`webpack.config.ts` is for setting environment variables defaults throughout the rest of the config.
You can use these variables to pass options to the rest of the config through the command line.
For example:

```bash
# (npm requires arguments be seperated by a double dash)
$ npm run build -- --env.TEST=true
```
Will set the member `TEST` to `true` on the options object.

Remember, the config code is just a typescript function that return a config object, so you can hypothetically configure it wherever and however is most convenient.

#### Build toggles / deployment-dependent variables

Inside `config.common.ts` is where the majority of the webpack configuration happens.

Of particular interest is the Plugins section where `DefinePlugin` is configured (look for the line about half-way down statring with `config.plugin("define")`).

Variables set in the object here will be replaced in the actual output JS code.
When compiling your code, webpack will perform a search and replace, replacing the variable names with the output of the supplied expression or value.

Because these values are evaluated once as a string (for the find-and-replace), and once as an expression, they either need to be wrapped in `JSON.stringify` or double quoted (ex. `VARIABLE: '"value-in-double-quotes"'`).

Webpack can do a lot with these variables and dead code elimination.

*__Caveats__: you need to let typescript know about these variables by declaring them in a type definitions (`.d.ts`) file.
Also be careful not to use too common of a name, because it will replace it throughout your code without warning.
A good standard is to make the variables all caps, and surrounded by double underscores, so they stand out (ex: `__REVISION__`).*

#### Additional Options

`config.common.ts` is for config options common to all environments.  Other environments can inherit from this file, and add to, or override options on the config object.

`config.dev.ts` is a specific environment configuration.  You can potentially have as many environments as you make files for.  To specify which environment to use, append `--env.ENV=` and the environment name to any commands.  An example is provided in `package.json`.

`config.local.ts` is an example configuration for local deploys.  If you want to deploy to a local server for testing, just edit the path in the file and run with `npm run local` or `npm run watch-local`.

Common options you may wish to configure:

`output.path`:  This is the output path for the compiled js.  If you are running a local server, you may consider adding an environment that outputs directly to the screeps local folder.  This is equivalent to the `localPath` setting in older versions of the screeps-typescript-starter.

`watchOptions.ignored`:  This option is only to save computer resources, since watch-mode (`npm start`) can be CPU intensive.  You can exclude directories you know don't need to be watched.

`module.rules`:  These are the individual rules webpack uses to process your code.  The defaults are generally all you will need.  The most useful change you may want to make here is to explicity `exclude` files or directories from being compiled or linted (in case of 3rd party code, for example).  These values, like all others can be passed around and modified before webpack acts on them.

#### Change the upload branch

You code is uploaded to the branch configured by the `branch` property on the object sent to `new ScreepsWebpackPlugin` (see `config/config.dev.ts`).  You have three ways to customize this:

1.  Multiple config environment files, each with a seperate branch
2.  Use the special variables `'$activeWorld'` to upload to whatever brach is active in the Screeps world
3.  Configure a new environment variable in `webpack.config.ts` and use that in your code.  For example:

```typescript
// webpack.custom-env.ts
const ScreepsWebpackPlugin = require("screeps-webpack-plugin");
const git = require('git-rev-sync'); // make sure you require `git-rev-sync`

const credentials: Credentials = require("./credentials.json");
credentials.branch = git.branch();

config.plugin("screeps").use(ScreepsWebpackPlugin, [credentials]);
```

The above example will automatically set your upload branch to be the same as your active git branch.  This is functionally equivalent to the option `"autobranch": true` in older versions.

You still have to create matching branch in screeps client by cloning an existing branch (API limitation). This is useful when setting up deployment pipelines that upload on commit after successful build (so a commit to `major_refactoring` branch doesn't overwrite your default branch in the middle of epic alliance action just because you forgot to update a pipeline configuration).

## To-Do

List of things that need to be finished.

### High-Priority Tasks

* Actual defensive/war code
* Creep Action/State code
* Controlled room job assignments:
  * Defender
  * Mineral miners
* Reserved rooms
  * Colony management logic
  * Job assignments
    * Scout
    * Reserver
    * Remote builder
    * Remote harvester
    * Remote hauler
    * Remote upgrader
    * Remote defender

### Future Ideas

These might not be implemented in the near future, but we thought these would be cool things to have in the codebase.

* Improved job system.
* Migration support (no more cleaning up your entire field before deploying).
* Write up a proper documentation of code.

## Contributing

Issues and Pull Requests are welcome! Please read the [Contributing Guidelines](CONTRIBUTING.md) beforehand.

## Special Thanks

[Marko Sulamägi](https://github.com/MarkoSulamagi), for the original [Screeps/TypeScript sample project](https://github.com/MarkoSulamagi/Screeps-typescript-sample-project).
