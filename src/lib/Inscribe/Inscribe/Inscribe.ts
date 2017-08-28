/*
 * Inscribe - a series of helper classes for improving the logging experience
 * on Screeps.
 */

/**
 * Initialise Inscribe functions to the global.
 *
 * @export
 */
export function init(): ScreepsInscribe {
  return { color, link, tooltip, time }
}

/**
 * Decorates a string of text with color.
 *
 * @param {string} str The string to format.
 * @param {string} fontColor Any HTML color name (`teal`) or hex code (`#33b5e5`).
 * @returns {string}
 */
export function color(str: string, fontColor: string): string {
  return `<span style="color:${fontColor}">${str}</span>`;
}

/**
 * Appends a link to log output
 *
 * @export
 * @param {string} href Any string-escaped link.
 * @param {string} title The link title.
 * @returns {string}
 */
export function link(href: string, title: string): string {
  return `<a href="${href}" target="_blank">${title}</a>`;
}

/**
 * Allows tooltip to be sent to the formatter
 *
 * @export
 * @param {string} str The string to format
 * @param {string} tooltipText The tooltip text to give away
 * @returns {string}
 */
export function tooltip(str: string, tooltipText: string): string {
  return `<abbr title='${tooltipText}'>${str}</abbr>`;
}

/**
 * Outputs a formatted version of `Game.time`
 *
 * @export
 * @param {string} [fontColor='gray'] Any HTML color name (`teal`) or hex code
 *   (`#33b5e5`). Defaults to `gray` if empty.
 * @returns {string}
 */
export function time(fontColor: string = 'gray'): string {
  return color(Game.time.toString(), fontColor);
}
