export enum LogLevel {
  DEBUG = 0,
  INFO,
  WARN,
  ERROR
}

const styles = {
  [LogLevel.DEBUG]: 'color: cyan',
  [LogLevel.INFO]: 'color: turquoise',
  [LogLevel.WARN]: 'color: yellow',
  [LogLevel.ERROR]: 'color: red'
}

const levelPrefixes = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR'
}

export class Logger implements StonehengeLogger {
  private prefix: string
  public level: LogLevel = LogLevel.INFO

  constructor (prefix: string = '') {
    this.prefix = prefix
  }

  private log(level: LogLevel, message: (() => string) | string): void {
    if (level >= this.level) {
      const out = typeof message === 'function' ? message() : message
      const style = styles[level]
      const levelPrefix = levelPrefixes[level]
      console.log(`<log severity="${level}"><span style="${style}">[${levelPrefix}]</span> ${this.prefix} ${out}</log>`)
    }
  }
  public debug (message: (() => string) | string): void {
    this.log(LogLevel.DEBUG, message)
  }
  public info (message: (() => string) | string): void {
    this.log(LogLevel.INFO, message)
  }
  public warn (message: (() => string) | string): void {
    this.log(LogLevel.WARN, message)
  }
  public error (message: (() => string) | string): void {
    this.log(LogLevel.ERROR, message)
  }
}
