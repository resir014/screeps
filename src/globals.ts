import { Logger } from 'utils/Logger'

const logger = new Logger('[global]')

global.hardReset = () => {
  logger.warn('A hard reset is performed.')
}
