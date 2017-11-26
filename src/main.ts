import { Logger } from 'lib/Logger'
import { BaseKernel } from 'os/BaseKernel'
import { ProcessRegistry } from 'os/ProcessRegistry'
import { ExtensionRegistry } from 'os/ExtensionRegistry'

import { bundle as bin } from './bin'

import './globals'

export const processRegistry = new ProcessRegistry()
export const extensionRegistry = new ExtensionRegistry()

const kernel = new BaseKernel(processRegistry, extensionRegistry)
global.kernel = kernel

processRegistry.install(bin)

export function loop() {
  kernel.start()
  kernel.run()
  kernel.shutdown()
}
