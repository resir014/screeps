import { log } from '../lib/logger'

/**
 * Check memory for null or out of bounds custom objects
 *
 * @export
 */
export function checkOutOfBoundsMemory(): void {
  if (!Memory.uuid || Memory.uuid > 100) {
    Memory.uuid = 0
  }

  if (!Memory.creeps) {
    Memory.creeps = {}
  }
  if (!Memory.flags) {
    Memory.flags = {}
  }
  if (!Memory.rooms) {
    Memory.rooms = {}
  }
  if (!Memory.spawns) {
    Memory.spawns = {}
  }
}

/**
 * Checks a room memory for null our out of bounds custom objects.
 *
 * @export
 * @param {Room} room The current room.
 */
export function initialiseRoomMemory(room: Room): void {
  if (!room.memory.jobs) {
    room.memory.jobs = {}
  }

  if (!room.memory.manualJobControl) {
    room.memory.manualJobControl = true
  }
}

/**
 * Refreshes every memory entry of mining positions available on the room.
 *
 * @export
 * @param {Room} room The current room.
 */
export function refreshMiningPositions(room: Room): void {
  if (!room.memory.sources) {
    room.memory.sources = []
  }
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
    const creep: any = Memory.creeps[name]

    if (creep.room === room.name) {
      if (!Game.creeps[name]) {
        log.info('Clearing non-existing creep memory:', name)

        if (Memory.creeps[name].role === 'sourceMiner') {
          // Push the now-dead creep's assigned source back to the sources array.
          room.memory.sources.push(Memory.creeps[name].assignedSource)
        }

        delete Memory.creeps[name]
      }
    } else if (_.keys(Memory.creeps[name]).length === 0) {
      log.info('Clearing non-existing creep memory:', name)
      delete Memory.creeps[name]
    }
  }
}
