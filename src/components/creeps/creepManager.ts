import * as Inscribe from 'screeps-inscribe'

import { ENABLE_DEBUG_MODE } from '../../config/constants'
import * as Logger from '../../utils/logger'

// We use globals for these objects, so let's declare it.
// declare const Orchestrator: IOrchestrator

/**
 * Initialization scripts for CreepManager module.
 *
 * @export
 * @param {Room} room
 */
export function runCreeps(room: Room): void {
  const creeps: Creep[] = room.find<Creep>(FIND_MY_CREEPS)

  if (ENABLE_DEBUG_MODE) {
    const out = [
      `[${Inscribe.color('CreepManager', 'skyblue')}]`,
      `[${Inscribe.color(room.name, 'hotpink')}]`,
      `${_.size(creeps)} creep(s) found in the playground.`
    ]
    Logger.debug(out.join(' '))
  }

  _.each(creeps, (creep: Creep) => {
    runSingleCreep(creep)
  })
}

export const runSingleCreep = (creep: Creep): void => {
  const role = require(`./roles/${creep.memory.role}`)
  role.run(creep)
}

export const getCreepsInRoom = (room: Room) => room.find<Creep>(FIND_MY_CREEPS)

export const filterCreepsByRole = (creeps: Creep[], role: string) =>
  creeps.filter((creep: Creep) => creep.memory.role === role)

export const isShortCreepRole = (creeps: Creep[], roomName: string) =>
  (role: string) => filterCreepsByRole(creeps, role).length < Memory.rooms[roomName].jobs[role]
