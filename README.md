# resir014-screeps

> Personal AI code for the game [Screeps](https://screeps.com/). Written in [TypeScript](http://www.typescriptlang.org/).

This starter kit is a modified version of the original [Screeps/TypeScript sample project](https://github.com/MarkoSulamagi/Screeps-typescript-sample-project) by [Marko Sulamägi](https://github.com/MarkoSulamagi).

## Getting Started

After you create a spawn, this bot will create 4 creeps which will start to harvest the closest source. The bots harvest, then transfer energy back to Spawn. If a creep's lifespan has depleted enough, it will refill in Spawn.

### Requirements

* [Node.js](https://nodejs.org/en/) (v4.0.0+)
* Gulp - `npm install -g gulp`
* TypeScript - `npm install -g typescript`
* Typings - `npm install -g typings`

### Quick setup

First, create a copy of `config.example.json` and rename it to `config.json`.

```bash
$ cp config.example.json config.json
```

Then change the `username` and `password` properties with your Screeps credentials.

**WARNING: DO NOT** commit this file into your repository!

Then run the following the command to install the required npm packages and TypeScript type definitions.

```bash
$ npm install
```

### Initial setup

If you just installed this code for the first time, it is **very important** that you perform the following tasks first!

* Delete your currently active code. (This stops the game until you push the new code.)
* Delete ALL currently active memory entries. (This will remove any memory conflicts.)

You can also do these tasks to clean up your memory should things go wrong.

### Running the compiler

```bash
# To compile your TypeScript files on the fly
$ npm start

# To deploy the code to Screeps
$ npm run deploy
```

## Special thanks

[Marko Sulamägi](https://github.com/MarkoSulamagi), for the original [Screeps/TypeScript sample project](https://github.com/MarkoSulamagi/Screeps-typescript-sample-project).
