import { Config } from './config/config';
import { MemoryManager } from './shared/memoryManager';
import { RoomManager } from './components/rooms/roomManager';
import { SpawnManager } from './components/spawns/spawnManager';
import { SourceManager } from './components/sources/sourceManager';
import { CreepManager } from './components/creeps/creepManager';

/**
 * Singleton object.
 * Since singleton classes are considered anti-pattern in Typescript, we can effectively use namespaces.
 * Namespace's are like internal modules in your Typescript application. Since GameManager doesn't need multiple instances
 * we can use it as singleton.
 */
export namespace GameManager {

  export function globalBootstrap() {
    // Set up your global objects.
    // This method is executed only when Screeps system instantiated new "global".

    // Use this bootstrap wisely. You can cache some of your stuff to save CPU
    // You should extend prototypes before game loop in here.

    RoomManager.loadRooms();
    SpawnManager.loadSpawns();
    SourceManager.loadSources();
  }

  export function loop() {
    // Loop code starts here
    // This is executed every tick

    MemoryManager.loadMemory();
    CreepManager.loadCreeps();

    // This creep garbage collection logic has to exist BEFORE the spawn logic,
    // else it would break the entire spawning logic.
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        if (Config.VERBOSE) {
          console.log('Clearing non-existing creep memory: ', name);
        }
        delete Memory.creeps[name];
      }
    }

    if (Config.VERBOSE) {
      if (!CreepManager.isHarvesterLimitFull()) {
        console.log('Need more harvesters!');
      }
      if (!CreepManager.isUpgraderLimitFull()) {
        console.log('Need more upgraders!');
      }
    }

    if (!CreepManager.isHarvesterLimitFull()) {
      CreepManager.createHarvester();
    } else if (!CreepManager.isUpgraderLimitFull()) {
      CreepManager.createUpgrader();
    }

    CreepManager.harvestersGoToWork();
    CreepManager.upgradersGoToWork();
  }

}
