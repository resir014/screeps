import { Config } from './config/config';
import { MemoryManager } from './shared/memoryManager';
import { RoomManager } from './components/rooms/roomManager';
import { SpawnManager } from './components/spawns/spawnManager';
import { SourceManager } from './components/sources/sourceManager';
import { FlagManager } from './components/flags/flagManager';
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
    FlagManager.loadFlags();
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

    // after garbage collection, we update all existing creep memory entries.
    MemoryManager.updateCreepMemory();

    if (CreepManager.harvesters.length < Config.MAX_HARVESTERS_PER_SOURCE) {
      CreepManager.createHarvester();
    } else if (CreepManager.upgraders.length < Config.MAX_UPGRADERS_PER_CONTROLLER) {
      CreepManager.createUpgrader();
    } else if (CreepManager.builders.length < Config.MAX_BUILDERS_IN_ROOM) {
      CreepManager.createBuilder();
    } else if (CreepManager.repairers.length < Config.MAX_REPAIRERS_IN_ROOM) {
      CreepManager.createRepairer();
    } else if (CreepManager.wallRepairers.length < Config.MAX_WALL_REPAIRERS_IN_ROOM) {
      CreepManager.createWallRepairer();
    }

    // specifies whether or not to use the new, experimental PathFinder object.
    PathFinder.use(Config.USE_PATHFINDER);

    CreepManager.harvestersGoToWork();
    CreepManager.upgradersGoToWork();
    CreepManager.buildersGoToWork();
    CreepManager.repairersGoToWork();
    CreepManager.wallRepairersGoToWork();
  }

}
