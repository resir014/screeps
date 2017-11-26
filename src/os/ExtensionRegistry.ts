import { Logger, LogLevel } from '../lib/Logger'

const logger = new Logger('[ExtensionRegistry]')
logger.level = LogLevel.DEBUG

export class ExtensionRegistry implements StonehengeExtension {
  private registry: { [interfaceId: string]: StonehengeExtension } = {}

  constructor() {
    this.register('extensions/ExtensionRegistry', this)
  }

  public register(interfaceId: string, extension: StonehengeExtension): boolean {
    if (this.registry[interfaceId]) {
      logger.error(`Interface ${interfaceId} is already registered.`)
      return false
    }
    this.registry[interfaceId] = extension
    logger.debug(`Registered ${interfaceId}`)
    return true
  }

  public unregister(interfaceId: string): boolean {
    if (this.registry[interfaceId]) {
      logger.debug(`Unregistered ${interfaceId}`)
      delete this.registry[interfaceId]
      return true
    } else {
      logger.error(`Interface ${interfaceId} is not registered.`)
      return false
    }
  }

  public getExtension(interfaceId: string): StonehengeExtension | undefined {
    if (!this.registry[interfaceId]) return
    return this.registry[interfaceId]
  }
}
