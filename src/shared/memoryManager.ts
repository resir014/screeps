/**
 * Check memory for null or out of bounds custom objects
 *
 * @export
 */
export function checkOutOfBounds() {
  if (!Memory.uuid || Memory.uuid > 100) {
    Memory.uuid = 0;
  }

  if (!Memory.creeps) {
    Memory.creeps = {};
  }
  if (!Memory.flags) {
    Memory.flags = {};
  }
  if (!Memory.rooms) {
    Memory.rooms = {};
  }
  if (!Memory.spawns) {
    Memory.spawns = {};
  }
}

/**
 * Refreshes every memory entry of mining positions available on the room.
 *
 * @export
 * @param {Room} room The current room.
 */
export function refreshMiningPositions(room: Room) {
  if (!Memory.rooms[room.name]) {
    Memory.rooms[room.name] = {};
  }
  if (!Memory.rooms[room.name].unoccupied_mining_positions) {
    Memory.rooms[room.name].unoccupied_mining_positions = [];
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
  // refactor: brought in from gameManager
  // clean up memory for deleted creeps
  for (let name in Memory.creeps) {
    let creep: any = Memory.creeps[name];

    if (creep.room === room.name) {
      if (!Game.creeps[name]) {
        console.log("[MemoryManager] Clearing non-existing creep memory:", name);

        if (Memory.creeps[name].role === "sourceMiner") {
          Memory.rooms[room.name].unoccupied_mining_positions
            .push(Memory.creeps[name].occupied_mining_position);
        }

        delete Memory.creeps[name];
      }
    } else if (_.keys(Memory.creeps[name]).length === 0) {
      console.log("[MemoryManager] Clearing non-existing creep memory:", name);
      delete Memory.creeps[name];
    }
  }
}
