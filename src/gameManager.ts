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

  // This method is called **only once**.
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
    ConstructionSiteManager.loadConstructionSites();
    StructureManager.loadStructures();

    // garbage collection. must run before any spawning logic.
    MemoryManager.cleanupCreepMemory();

    // updates all creep memory entries
    MemoryManager.updateCreepMemory();

    if (CreepManager.canCreateHarvester()) {
      CreepManager.createHarvester();
    } else if (CreepManager.canCreateUpgrader()) {
      CreepManager.createUpgrader();
    } else if (CreepManager.canCreateBuilder()) {
      CreepManager.createBuilder();
    } else if (CreepManager.canCreateRepairer()) {
      CreepManager.createRepairer();
    }

    // specifies whether or not to use the new, experimental PathFinder object.
    PathFinder.use(Config.USE_PATHFINDER);

    CreepManager.harvestersGoToWork();
    CreepManager.upgradersGoToWork();
    CreepManager.buildersGoToWork();
    CreepManager.repairersGoToWork();
  }

}
