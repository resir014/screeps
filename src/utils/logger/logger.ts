import * as Config from '../../config/config'
import * as Inscribe from '../../lib/Inscribe'
import { LogLevel } from './logLevel'

class Logger {
  constructor () {
    _.defaultsDeep(Memory, {
      log: {
        level: Config.LOG_LEVEL,
        showSource: Config.LOG_PRINT_LINES,
        showTick: Config.LOG_PRINT_TICK,
      }
    })
  }

  public get level(): number { return Memory.log.level }
  public set level(value: number) { Memory.log.level = value }
  public get showSource(): boolean { return Memory.log.showSource }
  public set showSource(value: boolean) { Memory.log.showSource = value }
  public get showTick(): boolean { return Memory.log.showTick }
  public set showTick(value: boolean) { Memory.log.showTick = value }

  public error(...args: any[]) {
    if (this.level >= LogLevel.ERROR) {
      console.log.apply(this, this.buildArguments(LogLevel.ERROR).concat([].slice.call(args)))
    }
  }

  public warning(...args: any[]) {
    if (this.level >= LogLevel.WARNING) {
      console.log.apply(this, this.buildArguments(LogLevel.WARNING).concat([].slice.call(args)))
    }
  }

  public info(...args: any[]) {
    if (this.level >= LogLevel.INFO) {
      console.log.apply(this, this.buildArguments(LogLevel.INFO).concat([].slice.call(args)))
    }
  }

  public debug(...args: any[]) {
    if (this.level >= LogLevel.DEBUG) {
      console.log.apply(this, this.buildArguments(LogLevel.DEBUG).concat([].slice.call(args)))
    }
  }

  private buildArguments(level: number): string[] {
    const out: string[] = []
    switch (level) {
      case LogLevel.ERROR:
        out.push(Inscribe.color('ERROR  ', 'red'))
        break
      case LogLevel.WARNING:
        out.push(Inscribe.color('WARNING', 'yellow'))
        break
      case LogLevel.INFO:
        out.push(Inscribe.color('INFO   ', 'green'))
        break
      case LogLevel.DEBUG:
        out.push(Inscribe.color('DEBUG  ', 'gray'))
        break
      default:
        break
    }
    if (this.showTick) {
      out.push(Inscribe.time())
    }
    return out
  }
}

export const log = new Logger()
