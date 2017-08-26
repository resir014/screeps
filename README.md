# Stonehenge

> Smart colony management for the game [Screeps](https://screeps.com/). Written in [TypeScript](http://www.typescriptlang.org/).

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Stonehenge is a proof-of-concept of a smart, robust, and maintainable [Screeps](https://screeps.com/) codebase. It is developed in [TypeScript](https://www.typescriptlang.org/), and designed with modularity in mind.

## Table of Contents

* [Design Principles](#design-principles)
* [Quick Start](#quick-start)
* [First-time deploy](#first-time-deploy)
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

By far, the easiest and quickest way to get started with TypeScript development on Screeps is to follow @bonzaiferroni's guides on Screeps World. Go read them!

* https://screepsworld.com/2017/07/typescreeps-getting-started-with-ts-in-screeps/
* https://screepsworld.com/2017/07/typescreeps-installing-everything-you-need/

### Requirements

We'll assume you have already downloaded/cloned the starter kit.

* [Node.js](https://nodejs.org/en/) (latest LTS is recommended)
* [Typings](https://github.com/typings/typings)
* [Yarn](https://yarnpkg.com/en/) - Optional. You can use `npm` if you don't want to, but this is for your own sanity.

### Installing the Modules

Run the following the command to install the required packages and TypeScript declaration files if you are using yarn:

```bash
$ yarn
```

or, for npm:

```bash
$ npm install
```

### Initial configuration

#### Configuring Screeps credentials

Create a copy of `config/credentials.example.json` and rename it to `config/credentials.json`.

**WARNING:** This file contains your secret credentials. **DO NOT** commit it into your repository!

```bash
# config/credentials.json
$ cp config/credentials.example.json config/credentials.json
```

In the newly created `credentials.json` file, change the `email` and `password` properties with your Screeps credentials.  The `serverPassword`, `token`, and `gzip` options are only for private servers that support them.  If you are uploading to the public Screeps server, you should delete these fields from your credentials file.

#### Changing the upload branch

Go to `config/config.dev.ts`, and you'll find the following lines:

```ts
const credentials: Credentials = require("./credentials.json");
credentials.branch = "dev";
```

Change the `credentials.branch` property you want to initially build and upload to, e.g. `"default"`. Note that due to the Screeps API limitations, you still have to create a branch with a matching name in the Screeps client by cloning an existing branch. The compiler will yell at you when you forgot to do so.

#### Advanced configuration

See [Configuration page](https://github.com/screepers/screeps-typescript-starter/wiki/Configuration) on the screeps-typescript-starter wiki for more in-depth info on configuration options.

### Running the compiler

```bash
# To compile and upload your TypeScript files on the fly in "watch mode":
$ npm start

# To compile and deploy once:
$ npm run deploy
```

## First-time deploy

If you just installed this code for the first time, it is **very important** that you perform the following tasks first!

### Pre-deploy steps

* Delete your currently active code. (This stops the game until you push the new code.)
* Delete ALL currently active memory entries. (This will remove any memory conflicts.)
* Kill ALL of your creeps.

You can also perform the above tasks to clean up your memory should things go wrong.

### Post-deploy steps

After deploying, you should manually set the build priorities for your rooms. Go to your respective room's memory in the memory tree, go to `jobs`, and set the number of creeps you'd like each role.

## Further reading

To find out more about what else you can do with screeps-typescript-starter, head over to the [screeps-typescript-starter wiki](https://github.com/screepers/screeps-typescript-starter/wiki) to find more guides, tips and tricks.

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
