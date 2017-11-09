import * as Logger from '../utils/logger'

/**
 * Check memory for null or out of bounds custom objects
 *
 * @export
 */
export function checkOutOfBoundsMemory(): void {
  _.defaultsDeep(Memory, {
    creeps: {},
    flags: {},
    rooms: {},
    spawns: {},
    stats: {},
    guid: 0
  })
}

/**
 * Checks a room memory for null our out of bounds custom objects.
 *
 * @export
 * @param {Room} room The current room.
 */
export function initialiseRoomMemory(room: Room): void {
  _.defaultsDeep(room.memory, {
    jobs: {},
    queue: []
  })
}

/**
 * Creates a guid as a global identifier for our creeps/room objects.
 *
 * @export
 * @returns {number} The current free guid.
 */
export function getGuid(): number {
  if (!Memory.guid || Memory.guid > 10000) {
    Memory.guid = 0
  }

  return Memory.guid
}

/**
 * Refreshes every memory entry of mining positions available on the room.
 *
 * @export
 * @param {Room} room The current room.
 */
export function refreshMiningPositions(room: Room): void {
  _.defaultsDeep(room.memory, {
    sources: []
  })
}

/**
 * Clean up creep memory. Delete any creeps in memory that no longer exist in
 * a designated room.
 *
 * @export
 * @param {Room} room The current room.
 */
export function cleanupCreepMemory(room: Room): void {
  for (const name in Memory.creeps) {
    if (Memory.creeps[name]) {
      const creep: any = Memory.creeps[name]

      if (creep.room === room.name) {
        if (!Game.creeps[name]) {
          Logger.info(`Clearing non-existing creep memory: ${name}`)
          delete Memory.creeps[name]
        }
      } else if (_.keys(Memory.creeps[name]).length === 0) {
        Logger.info(`Clearing non-existing creep memory: ${name}`)
        delete Memory.creeps[name]
      }
    }
  }
}
