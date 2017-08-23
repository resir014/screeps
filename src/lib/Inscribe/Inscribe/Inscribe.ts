import * as Config from '../../../config/config'
import { LogLevel } from './LogLevel'

interface InscribeOptions {
  level?: LogLevel
}

export class Inscribe {
  constructor () {
    _.defaultsDeep(Memory, {
      inscribe: {
        level: Config.LOG_LEVEL,
        printTick: Config.LOG_PRINT_TICK
      }
    })
  }

  /**
   * Outputs a pretty-formatted message into the Screeps console
   *
   * @static
   * @param {string} message The message to print into the console
   * @param {InscribeOptions} [options={}] Options provided for Inscribe
   * @returns the pretty-formatted message in the console
   * @memberof Inscribe
   */
  public static write(message: string, options: InscribeOptions = {}) {
    switch (options.level) {
      case LogLevel.DEBUG: {
        return debug(message)
      }
      case LogLevel.INFO: {
        return info(message)
      }
      case LogLevel.WARNING: {
        return warning(message)
      }
      case LogLevel.ERROR: {
        return error(message)
      }
      default: {
        return info(message)
      }
    }
  }

  /**
   * Decorates a string of text with color.
   *
   * @static
   * @param {string} str The string to format
   * @param {string} color Any HTML color name (`teal`) or hex code (`#33b5e5`).
   * @returns {string}
   * @memberof Inscribe
   */
  public static color(str: string, color: string): string {
    return `<span style="color:${color}">${str}</span>`;
  }

  /**
   * Appends a link to log output
   *
   * @static
   * @param {string} href Any string-escaped link.
   * @param {string} title The link title.
   * @returns {string}
   * @memberof Inscribe
   */
  public static link(href: string, title: string): string {
    return `<a href="${href}" target="_blank">${title}</a>`;
  }

  /**
   * Allows tooltip to be sent to the formatter
   *
   * @static
   * @param {string} str The string to format
   * @param {string} tooltip The tooltip text to give away
   * @returns {string}
   * @memberof Inscribe
   */
  public static tooltip(str: string, tooltip: string): string {
    return `<abbr title='${tooltip}'>${str}</abbr>`;
  }

  /**
   * Outputs a formatted version of `Game.time`
   *
   * @static
   * @param {number} time
   * @returns {string}
   * @memberof Inscribe
   */
  public static time(time: number): string {
    return Inscribe.color(time.toString(), 'gray');
  }
}

function debug(...args: any[]) {
  if (Config.LOG_LEVEL >= LogLevel.DEBUG) {
    console.log(buildArguments(LogLevel.DEBUG), args);
  }
}

function info(...args: any[]) {
  if (Config.LOG_LEVEL >= LogLevel.INFO) {
    console.log(buildArguments(LogLevel.INFO), args);
  }
}

function warning(...args: any[]) {
  if (Config.LOG_LEVEL >= LogLevel.WARNING) {
    console.log(buildArguments(LogLevel.WARNING), args);
  }
}

function error(...args: any[]) {
  if (Config.LOG_LEVEL >= LogLevel.ERROR) {
    console.log(buildArguments(LogLevel.ERROR), args);
  }
}

function buildArguments(level: LogLevel) {
  let out: string = ''
  switch (level) {
    case LogLevel.DEBUG: {
      out += Inscribe.color(_.padRight('DEBUG', 8, ' '), 'gray')
      break
    }
    case LogLevel.INFO: {
      out += Inscribe.color(_.padRight('INFO', 8, ' '), 'lime')
      break
    }
    case LogLevel.WARNING: {
      out += Inscribe.color(_.padRight('WARNING', 8, ' '), 'yellow')
      break
    }
    case LogLevel.ERROR: {
      out += Inscribe.color(_.padRight('ERROR', 8, ' '), 'red')
      break
    }
    default: {
      break
    }
  }
  if (Config.LOG_PRINT_TICK) {
    out += `${Inscribe.time(Game.time)}`;
  }
  return out
}
