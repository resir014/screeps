import { Logger } from '../utils/logger'

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
    uuid: 0
  })

  if (!Memory.uuid || Memory.uuid > 10000) {
    Memory.uuid = 0
  }
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
    manualJobControl: true
  })
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

          if (Memory.creeps[name].role === 'sourceMiner') {
            // Push the now-dead creep's assigned source back to the sources array.
            room.memory.sources.push(Memory.creeps[name].assignedSource)
          }

          delete Memory.creeps[name]
        }
      } else if (_.keys(Memory.creeps[name]).length === 0) {
        Logger.info(`Clearing non-existing creep memory: ${name}`)
        delete Memory.creeps[name]
      }
    }
  }
}
