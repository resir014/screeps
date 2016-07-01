import { Config } from './config/config';
import { MemoryManager } from './shared/memoryManager';
import { RoomManager } from './components/rooms/roomManager';
import { SpawnManager } from './components/spawns/spawnManager';
import { SourceManager } from './components/sources/sourceManager';
import { CreepManager } from './components/creeps/creepManager';
import { ConstructionSiteManager } from './components/constructionSites/constructionSiteManager';
import { StructureManager } from './components/structures/structureManager';

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
    ConstructionSiteManager.loadConstructionSites();
    StructureManager.loadStructures();
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
          console.log('[GameManager] Clearing non-existing creep memory:', name);
        }
        delete Memory.creeps[name];
      }
    }

    if (CreepManager.canCreateHarvester()) {
      CreepManager.createHarvester();
    } else if (CreepManager.canCreateUpgrader()) {
      CreepManager.createUpgrader();
    } else if (CreepManager.canCreateBuilder()) {
      CreepManager.createBuilder();
    } else if (CreepManager.canCreateRepairer()) {
      CreepManager.createRepairer();
    }

    CreepManager.harvestersGoToWork();
    CreepManager.upgradersGoToWork();
    CreepManager.buildersGoToWork();
    CreepManager.repairersGoToWork();
  }

}
