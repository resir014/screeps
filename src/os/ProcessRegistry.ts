import { Logger, LogLevel } from '../lib/Logger'

const logger = new Logger('[ProcessRegistry]')
logger.level = LogLevel.DEBUG

export class ProcessRegistry implements StonehengeProcessRegistry {
  private registry: { [imageName: string]: StonehengeProcessConstructor<any> } = {}

  public register<T extends ProcessMemory>(imageName: string, constructor: StonehengeProcessConstructor<T>): boolean {
    if (this.registry[imageName]) {
      logger.error(`Image already registered: ${imageName}`)
      return false
    }
    logger.debug(`Registered ${imageName}`)
    this.registry[imageName] = constructor
    return true
  }

  public install(bundle: StonehengeBundle<any>) {
    bundle.install(this)
  }

  public getNewProcess<T extends ProcessMemory>(imageName: string, context: StonehengeProcessContext<T>): StonehengeProcess<T> | undefined {
    if (!this.registry[imageName]) {
      logger.error(`${imageName} is not registered.`)
      return undefined
    }
    logger.debug(`Created ${imageName}`)
    return new this.registry[imageName](context) as StonehengeProcess<T>
  }
}
