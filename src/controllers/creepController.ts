import * as Inscribe from 'screeps-inscribe'

import * as CreepManager from '../components/creeps/creepManager'
import * as Constants from '../config/constants'
import * as Logger from '../utils/logger'

/**
 * Initialization scripts for CreepManager module.
 *
 * @export
 * @param {Room} room
 */
export function runCreeps(room: Room): void {
  const creeps: Creep[] = room.find<Creep>(FIND_MY_CREEPS)

  if (Constants.ENABLE_DEBUG_MODE) {
    const out = [
      `[${Inscribe.color('CreepManager', 'skyblue')}]`,
      `[${Inscribe.color(room.name, 'hotpink')}]`,
      `${_.size(creeps)} creep(s) found in the playground.`
    ]
    Logger.debug(out.join(' '))
  }

  _.each(creeps, (creep: Creep) => {
    CreepManager.runSingleCreep(creep)
  })
}
