import { Config } from './../../config/config';

export namespace SpawnManager {

  export let spawns: Spawn[];
  export let spawnNames: string[] = [];
  export let spawnCount: number = 0;

  /**
   * Initialization scripts for the SpawnManager namespace.
   *
   * @export
   * @param {Room} room
   */
  export function load(room: Room) {
    spawns = room.find<Spawn>(FIND_MY_SPAWNS);
    spawnCount = _.size(spawns);

    _loadSpawnNames();

    if (Config.VERBOSE) {
      console.log('[SpawnManager] ' + spawnCount + ' spawns in room.');
    }
  }

  /**
   * Returns the first spawn from the list.
   *
   * @export
   * @returns {Spawn}
   */
  export function getFirstSpawn(): Spawn {
    return spawns[spawnNames[0]];
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
    let status: number | string = spawn.canCreateCreep(body, null);

    let properties: { [key: string]: any } = {
      role: role,
      room: spawn.room.name
    };

    status = _.isString(status) ? OK : status;
    if (status === OK) {
      if (Config.VERBOSE) {
        console.log('[SpawnManager] Started creating new creep.');
        console.log('[SpawnManager] Role: ' + role);
        console.log('[SpawnManager] Body: ' + body);
      }

      status = spawn.createCreep(body, null, properties);

      return _.isString(status) ? OK : status;
    } else {
      if (Config.VERBOSE) {
        console.log('[SpawnManager] Failed creating new creep: ' + status);
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

}
