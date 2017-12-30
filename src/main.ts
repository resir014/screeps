import { Logger, LogLevel } from 'lib/Logger'
import { ErrorMapper } from 'lib/ErrorMapper'
import { BaseKernel } from 'os/BaseKernel'
import { ProcessRegistry } from 'os/ProcessRegistry'
import { ExtensionRegistry } from 'os/ExtensionRegistry'

import { bundle as bin } from 'bin'

import './globals'

const log = new Logger('[main]')
log.level = LogLevel.DEBUG

log.info('Stonehenge (v0.0.3)')
log.info('Smart colony management for the game Screeps. Written in TypeScript.')

log.debug('Bootstrapping...')

export const processRegistry = new ProcessRegistry()
export const extensionRegistry = new ExtensionRegistry()

const kernel = new BaseKernel(processRegistry, extensionRegistry)
global.kernel = kernel

extensionRegistry.register('BaseKernel', kernel)

processRegistry.install(bin)

log.debug('Kernel bootstrapped.')

const kloop = () => {
  kernel.start()
  kernel.run()
  kernel.shutdown()
}

export const loop = ErrorMapper.wrapLoop(kloop)
