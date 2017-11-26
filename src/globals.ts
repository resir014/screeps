import { Logger } from 'lib/Logger'

const logger = new Logger('[global]')

global.hardReset = () => {
  logger.warn('A hard reset is performed.')
}
