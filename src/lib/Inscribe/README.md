# screeps-inscribe

> A one-size-fits-all toolbox for detailed logging in TypeScript-based Screeps codes.

## Installation

At the moment, the only supported way to install this library is through a git submodule.

```bash
$ git submodule add https://github.com/resir014/screeps-inscribe.git src/lib/Inscribe
```

Installation through npm will be available soon. Hang tight!

## Usage

To enable accessing Inscribe commands through the CLI, add the following to your `main.js`, outside of the game loop.

```js
global.Inscribe = Inscribe.init()
```

```js
import * as Inscribe from 'screeps-inscribe'

console.log(`[${Inscribe.color('main', 'skyblue')}] Scripts bootstrapped`)
```

## API Reference

### color

`Inscribe.color(str: string, fontColor: string): string`

Decorates a string of text with color.

#### Parameters

- `str: string` The string to format.
- `fontColor: string` Any HTML color name (`teal`) or hex code (`#33b5e5`).

Returns: A string output of the color-formatted text.

### link

`Inscribe.link(href: string, title: string): string`

Appends a link to log output

#### Parameters

- `href: string` Any string-escaped link.
- `title: string` The link title.

Returns: A console output string with link.

### tooltip

`Inscribe.tooltip(str: string, tooltipText: string): string`

Allows tooltip to be sent to the formatter

#### Parameters

- `str: string` The string to format
- `tooltipText: string` The tooltip text to give away

Returns: The tooltipped text for the Screeps console.

### time

`Inscribe.time(color?: string)`

Outputs a formatted version of `Game.time`

#### Parameters

- `color?: string` Any HTML color name (`teal`) or hex code (`#33b5e5`). Defaults to `gray` if empty.

Returns: A pretty-formatted `Game.time`.
