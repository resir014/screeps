import { Logger } from 'lib/Logger'
import { BaseKernel } from 'os/BaseKernel'
import { ProcessRegistry } from 'os/ProcessRegistry'

import { bundle as bin } from './bin'

import './globals'

export const processRegistry = new ProcessRegistry()

const kernel = new BaseKernel(processRegistry)

processRegistry.install(bin)

export function loop() {
  kernel.start()
  kernel.run()
  kernel.shutdown()
}
