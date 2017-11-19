import * as Inscribe from 'screeps-inscribe'

import { ENABLE_DEBUG_MODE } from '../../config/constants'
import * as Logger from '../../utils/logger'

import { getGuid } from '../../shared/memoryManager'

// import { getCreepsInRoom, filterCreepsByRole, isShortCreepRole } from '../creeps/creepManager'
import { enqueueSpawnRequest, dequeueSpawnRequest } from '../../utils/queue/spawnQueue'

export const getSpawnsThatArentSpawning = (room: Room) => room.find<Spawn>(FIND_MY_SPAWNS, {
  filter: (spawn: Spawn) => spawn.spawning === null
})

export const runSpawns = (room: Room) => {
  const spawns = getSpawnsThatArentSpawning(room)

  for (const spawn of spawns) {
    if (ENABLE_DEBUG_MODE) {
      const out = [
        `[${Inscribe.color('CreepManager', 'skyblue')}]`,
        `[${Inscribe.color(room.name, 'hotpink')}]`,
        `Spawning from: ${spawn.name}`
      ]
      Logger.debug(out.join(' '))
    }

    spawnCreepFromQueue(spawn, room)
  }
}

// Try to imitate the deprecated `spawn.canCreateCreep()` API.
export const canSpawnCreep = (spawn: Spawn) =>
  (role: string, bp?: BodyPartConstant[]) => {
    const bodyParts = bp || getBodyPartsForCreep(role, spawn)
    return spawn.spawnCreep(bodyParts, 'test', { dryRun: true })
  }

export const spawnCreepFromQueue = (spawn: Spawn, room: Room) => {
  const guid: number = getGuid()
  const queue = dequeueSpawnRequest(room)

  if (queue) {
    let status = canSpawnCreep(spawn)(queue.role)

    if (status === OK) {
      Memory.guid = guid + 1
      const creepName: string = `[${guid}] ${spawn.room.name} - ${queue.role}`
      const bodyParts = getBodyPartsForCreep(queue.role, spawn)

      const memory: CreepMemory = {
        role: queue.role,
        room: room.name,
        target: {
          room: queue.target.room,
          id: queue.target.id
        }
      }

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

      status = spawn.spawnCreep(bodyParts, creepName, { memory })

      // `spawnCreep()` actually returns a return code instead of a string now,
      // but just to make sure, we're going to put this here.
      return _.isString(status) ? OK : status
    } else {
      if (ENABLE_DEBUG_MODE) {
        const out = [
          `[${Inscribe.color('CreepManager', 'skyblue')}]`,
          `[${Inscribe.color(spawn.name, 'hotpink')}]`,
          `Failed creating new creep: ${status}`
        ]
        Logger.error(out.join(' '))
      }

      // Don't forget to push failed jobs back to the queue.
      enqueueSpawnRequest(room, queue)

      return status
    }
  } else {
    if (ENABLE_DEBUG_MODE) {
      const out = [
        `[${Inscribe.color('CreepManager', 'skyblue')}]`,
        `[${Inscribe.color(spawn.name, 'hotpink')}]`,
        `Failed creating new creep: No arguments set. (${ERR_INVALID_ARGS})`
      ]
      Logger.error(out.join(' '))
    }
    return ERR_INVALID_ARGS
  }
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
