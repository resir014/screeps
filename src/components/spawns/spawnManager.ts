import * as Config from "./../../config/config";
import * as MemoryManager from "./../../shared/memoryManager";

export let spawns: Spawn[];
export let spawnNames: string[] = [];
export let spawnCount: number = 0;

/**
 * Initialization scripts for the SpawnManager module.
 *
 * @export
 * @param {Room} room
 */
export function load(room: Room) {
  spawns = room.find<Spawn>(FIND_MY_SPAWNS);
  spawnCount = _.size(spawns);

  _loadSpawnNames();

  if (Config.VERBOSE) {
    console.log("[SpawnManager] " + spawnCount + " spawns in room.");
  }
}

/**
 * Returns the first spawn from the list.
 *
 * @export
 * @returns {Spawn}
 */
export function getFirstSpawn(): Spawn {
  return spawns[0];
}

/**
 * Spawns a new creep.
 *
 * @export
 * @param {Spawn} spawn
 * @param {string[]} body
 * @param {string} role
 * @returns {(number | string)}
 */
export function spawnCreep(spawn: Spawn, body: string[], role: string): number | string {
  let uuid: number = MemoryManager.memory["uuid"];
  let status: number | string = spawn.canCreateCreep(body, null);

  let properties: { [key: string]: any } = {
    role: role,
    room: spawn.room.name
  };

  status = _.isString(status) ? OK : status;
  if (status === OK) {
    MemoryManager.memory["uuid"] = uuid + 1;
    let creepName: string = spawn.room.name + " - " + role + uuid;

    console.log("[SpawnManager] Started creating new creep: " + creepName);
    if (Config.VERBOSE) {
      console.log("[SpawnManager] Body: " + body);
    }

    status = spawn.createCreep(body, creepName, properties);

    return _.isString(status) ? OK : status;
  } else {
    if (Config.VERBOSE) {
      console.log("[SpawnManager] Failed creating new creep: " + status);
    }

    return status;
  }
}

/**
 * Loads all Spawn names and returns them into an array.
 */
function _loadSpawnNames(): void {
  for (let spawnName in spawns) {
    if (spawns.hasOwnProperty(spawnName)) {
      spawnNames.push(spawnName);
    }
  }
}
