import { ENABLE_DEBUG_MODE } from '../../config/config'
import { Logger } from '../../utils/logger'

import { Harvester } from './roles/harvester'
import { Hauler } from './roles/hauler'
import { Upgrader } from './roles/upgrader'
import { Builder } from './roles/builder'
import { Repairer } from './roles/repairer'
import { WallMaintainer } from './roles/wallMaintainer'
import { DefenseRepairer } from './roles/defenseRepairer'

// We use globals for these objects, so let's declare it.
declare const Orchestrator: IOrchestrator
declare const Inscribe: InscribeGlobal

interface SortedCreepObject {
  [key: string]: Creep[]
}

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
  _manageCreeps(room, creeps)

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

const isShortCreepRoleGen = (creeps: SortedCreepObject, roomName: string) =>
  (role: string) => creeps[role + 's'].length < Memory.rooms[roomName].jobs[role]

const spawnCreepWithRoleGen = (spawn: Spawn, spawnCreepFunc: (spawn: Spawn, bodyParts: string[], role: string) => number) =>
  (role: string) => {
    const bodyParts = Orchestrator.getBodyParts(role, spawn)
    spawnCreepFunc(spawn, bodyParts, role)
  }

function _manageCreeps(room: Room, creeps: Creep[]): void {
  const spawns: Spawn[] = room.find<Spawn>(FIND_MY_SPAWNS, {
    filter: (spawn: Spawn) => {
      return spawn.spawning === null
    },
  })

  // Iterate through each creep roles and push them into the assorted role object.
  const assortedCreeps: SortedCreepObject = {
    harvesters: creeps.filter((creep: Creep) => creep.memory.role === 'harvester'),
    haulers: creeps.filter((creep: Creep) => creep.memory.role === 'hauler'),
    builders: creeps.filter((creep: Creep) => creep.memory.role === 'builder'),
    upgraders: creeps.filter((creep: Creep) => creep.memory.role === 'upgrader'),
    repairers: creeps.filter((creep: Creep) => creep.memory.role === 'repairer'),
    wallMaintainers: creeps.filter((creep: Creep) => creep.memory.role === 'wallMaintainer'),
    roadMaintainers: creeps.filter((creep: Creep) => creep.memory.role === 'roadMaintainer'),
    defenseRepairers: creeps.filter((creep: Creep) => creep.memory.role === 'defenseRepairer'),
    defenders: creeps.filter((creep: Creep) => creep.memory.role === 'defender'),
    mineralMiners: creeps.filter((creep: Creep) => creep.memory.role === 'mineralMiner')
  }

  const isShortCreepRole = isShortCreepRoleGen(assortedCreeps, room.name)

  for (const spawn of spawns) {
    if (ENABLE_DEBUG_MODE) {
      const out = [
        `[${Inscribe.color('CreepManager', 'skyblue')}]`,
        `[${Inscribe.color(room.name, 'hotpink')}]`,
        `Spawning from: ${spawn.name}`
      ]
      Logger.debug(out.join(' '))
    }

    const spawnCreepWithRole = spawnCreepWithRoleGen(spawn, _spawnCreep)

    // There needs to be at least two harvesters AND one haulers
    // before we prioritise spawning anything else. If not, we'll prioritise
    // spawning harvesters first.
    if (assortedCreeps.harvesters.length > 1 && assortedCreeps.haulers.length >= 1) {
      // We already have two harvesters.
      if (isShortCreepRole('hauler')) {
        spawnCreepWithRole('hauler')
      } else if (isShortCreepRole('harvester')) {
        spawnCreepWithRole('harvester')
      } else if (isShortCreepRole('upgrader')) {
        spawnCreepWithRole('upgrader')
      } else if (isShortCreepRole('builder')) {
        spawnCreepWithRole('builder')
      } else if (isShortCreepRole('repairer')) {
        spawnCreepWithRole('repairer')
      } else if (isShortCreepRole('defenseRepairer')) {
        spawnCreepWithRole('defenseRepairer')
      } else if (isShortCreepRole('roadMaintainer')) {
        spawnCreepWithRole('roadMaintainer')
      }
    } else {
      // We don't have two harvesters yet.
      if (isShortCreepRole('harvester')) {
        const role = 'harvester'
        const bodyParts = [WORK, WORK, MOVE, MOVE]
        _spawnCreep(spawn, bodyParts, role)
      } else if (isShortCreepRole('hauler')) {
        const role = 'hauler'
        const bodyParts = [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]
        _spawnCreep(spawn, bodyParts, role)
      }
    }
  }
}

function _spawnCreep(spawn: Spawn, bodyParts: string[], role: string): number {
  const guid: number = Orchestrator.getGuid()
  const canCreateCreep = spawn.canCreateCreep(bodyParts)

  const properties: { [key: string]: any } = {
    role,
    room: spawn.room.name,
  }

  if (ENABLE_DEBUG_MODE) {
    const out = [
      `[${Inscribe.color('CreepManager', 'skyblue')}]`,
      `[${Inscribe.color(spawn.name, 'hotpink')}]`,
      `Attempting to create new ${properties.role} in room ${properties.room}`
    ]
    Logger.debug(out.join(' '))
  }

  if (canCreateCreep === OK) {
    Memory.guid = guid + 1
    const creepName: string = `[${guid}] ${spawn.room.name} - ${role}`

    const creepCreateStarted = [
      `[${Inscribe.color('CreepManager', 'skyblue')}]`,
      `[${Inscribe.color(spawn.name, 'hotpink')}]`,
      `Started creating new creep: ${Inscribe.color(creepName, 'hotpink')}`
    ]
    Logger.info(creepCreateStarted.join(' '))
    if (ENABLE_DEBUG_MODE) {
      const outBody = [
        `[${Inscribe.color('CreepManager', 'skyblue')}]`,
        `[${Inscribe.color(spawn.name, 'hotpink')}]`,
        `Body: ${bodyParts}`
      ]
      const outGuid = [
        `[${Inscribe.color('CreepManager', 'skyblue')}]`,
        `[${Inscribe.color(spawn.name, 'hotpink')}]`,
        `guid: ${guid}`
      ]
      Logger.debug(outBody.join(' '))
      Logger.debug(outGuid.join(' '))
    }

    // `createCreep()` returns a string instead of OK, so we handle a string the same as if OK.
    const status = spawn.createCreep(bodyParts, creepName, properties)
    return _.isString(status) ? OK : status
  } else {
    if (ENABLE_DEBUG_MODE) {
      const out = [
        `[${Inscribe.color('CreepManager', 'skyblue')}]`,
        `[${Inscribe.color(spawn.name, 'hotpink')}]`,
        `Failed creating new creep: ${canCreateCreep}`
      ]
      Logger.error(out.join(' '))
    }

    return canCreateCreep
  }
}
