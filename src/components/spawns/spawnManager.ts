import { Config } from './../../config/config';

export namespace SpawnManager {

  export var spawns: Spawn[];
  export var spawnNames: string[] = [];
  export var spawnCount: number = 0;

  export function loadSpawns(room: Room) {
    spawns = room.find<Spawn>(FIND_MY_SPAWNS);
    spawnCount = _.size(spawns);

    _loadSpawnNames();

    if (Config.VERBOSE) {
      console.log('[SpawnManager] ' + spawnCount + ' spawns in room.');
    }
  }

  export function getFirstSpawn(): Spawn {
    return spawns[spawnNames[0]];
  }

  function _loadSpawnNames() {
    for (let spawnName in spawns) {
      if (spawns.hasOwnProperty(spawnName)) {
        spawnNames.push(spawnName);
      }
    }
  }

}
