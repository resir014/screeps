import * as Inscribe from 'screeps-inscribe'

import { ENABLE_DEBUG_MODE } from '../../config/constants'
import * as Logger from '../../utils/logger'

import { Harvester } from './role-legacy/harvester'
import { Hauler } from './role-legacy/hauler'
import { Upgrader } from './role-legacy/upgrader'
import { Builder } from './role-legacy/builder'
import { Repairer } from './role-legacy/repairer'
import { WallMaintainer } from './role-legacy/wallMaintainer'
import { DefenseRepairer } from './role-legacy/defenseRepairer'

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

  // Builds missing creeps where necessary
  // _manageCreeps(room, creeps)

  _.each(creeps, (creep: Creep) => {
    if (creep.memory.role === 'harvester') {
      const harvester = new Harvester(creep)
      harvester.run()
    }
    if (creep.memory.role === 'hauler') {
      const hauler = new Hauler(creep)
      hauler.run()
    }
    if (creep.memory.role === 'builder') {
      const builder = new Builder(creep)
      builder.run()
    }
    if (creep.memory.role === 'upgrader') {
      const upgrader = new Upgrader(creep)
      upgrader.run()
    }
    if (creep.memory.role === 'repairer') {
      const repairer = new Repairer(creep)
      repairer.run()
    }
    if (creep.memory.role === 'wallMaintainer') {
      const wallMaintainer = new WallMaintainer(creep)
      wallMaintainer.run()
    }
    if (creep.memory.role === 'defenseRepairer') {
      const defenseRepairer = new DefenseRepairer(creep)
      defenseRepairer.run()
    }
  })
}

export const getCreepsInRoom = (room: Room) => room.find<Creep>(FIND_MY_CREEPS)

export const filterCreepsByRole = (creeps: Creep[], role: string) =>
  creeps.filter((creep: Creep) => creep.memory.role === role)

export const isShortCreepRole = (creeps: Creep[], roomName: string) =>
  (role: string) => filterCreepsByRole(creeps, role).length < Memory.rooms[roomName].jobs[role]
