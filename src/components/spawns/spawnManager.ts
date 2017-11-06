import * as Inscribe from 'screeps-inscribe'

import { ENABLE_DEBUG_MODE } from '../../config/config'
import { Logger } from '../../utils/logger'

import { getCreepsInRoom, filterCreepsByRole, isShortCreepRole } from '../creeps/creepManager'

type SpawnCreepFunction = (spawn: Spawn, bodyParts: BodyPartConstant[], role: string) => number

// We use globals for these objects, so let's declare it.
// declare const Orchestrator: IOrchestrator

export const getSpawnsThatArentSpawning = (room: Room) => room.find<Spawn>(FIND_MY_SPAWNS, {
  filter: (spawn: Spawn) => spawn.spawning === null
})

export const runSpawns = (room: Room) => {
  const spawns = getSpawnsThatArentSpawning(room)
  const creeps = getCreepsInRoom(room)

  for (const spawn of spawns) {
    if (ENABLE_DEBUG_MODE) {
      const out = [
        `[${Inscribe.color('CreepManager', 'skyblue')}]`,
        `[${Inscribe.color(room.name, 'hotpink')}]`,
        `Spawning from: ${spawn.name}`
      ]
      Logger.debug(out.join(' '))
    }

    // There needs to be at least two harvesters AND one haulers
    // before we prioritise spawning anything else. If not, we'll prioritise
    // spawning harvesters first.
    if (filterCreepsByRole(creeps, 'harvester').length > 1 && filterCreepsByRole(creeps, 'hauler').length > 1) {
      if (canSpawnCreep(spawn)('hauler')) {
        spawnCreepWithRole(spawn, _spawnCreep)('hauler')
      }
    } else {
      if (isShortCreepRole(creeps, room.name)('harvester')) {
        // spawnCreepWithRole(spawn, _spawnCreep)('hauler')
      }
    }
  }
}

export const canSpawnCreep = (spawn: Spawn) =>
  (role: string, bp?: BodyPartConstant[]) => {
    const bodyParts = bp || getBodyPartsForCreep(role, spawn)
    spawn.spawnCreep(bodyParts, 'test', { dryRun: true })
  }

export const spawnCreepWithRole = (spawn: Spawn, func: SpawnCreepFunction) =>
  (role: string, bp?: BodyPartConstant[]) => {
    const bodyParts = bp || getBodyPartsForCreep(role, spawn)
    func(spawn, bodyParts, role)
  }

const _spawnCreep = (spawn: Spawn, bodyParts: BodyPartConstant[], role: string) => {
  return 0
}

export const getBodyPartsForCreep = (role: string, spawn: Spawn) => {
  // So here we have an API call to build the required bodyparts for our
  // creep. This utilizes tinnvec's super-useful spawn prototype extensions,
  // where you can generate the largest bodypart a room can build based on a
  // build template.
  //
  // The bodypart templates included should be proportional enough based on
  // the passed role. For example:
  //
  // * Harvesters should have 50% WORK parts and 50% MOVE parts.
  // * Builders should have 50% MOVE parts, 25% CARRY parts, and 25% WORK
  //   parts.
  // * Haulers should have 50% CARRY parts and 50% MOVE parts.
  //
  // If you dont like these proportions, free to modify the templates based
  // on your needs below.

  let bodyParts: BodyPartConstant[] = []

  switch (role) {
    case 'hauler':
      bodyParts = spawn.getLargestBuildableBodyFromTemplate([WORK, WORK, CARRY, MOVE])
      break
    case 'harvester':
      bodyParts = spawn.getLargestBuildableBodyFromTemplate([WORK, MOVE])
      break
    default:
      bodyParts = spawn.getLargestBuildableBodyFromTemplate([CARRY, MOVE])
      break
  }

  if (ENABLE_DEBUG_MODE) {
    const out = [
      `[${Inscribe.color('Orchestrator', 'skyblue')}]`,
      `[${Inscribe.color('getBodyParts', 'skyblue')}]`,
      `Got bodyparts: ${bodyParts.join(', ')}`
    ]
    Logger.debug(out.join(' '))
  }

  return bodyParts
}
