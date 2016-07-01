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

  export var harvesters: Creep[] = [];
  export var upgraders: Creep[] = [];
  export var builders: Creep[] = [];
  export var repairers: Creep[] = [];

  // This method is called **only once**.
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

    // garbage collection. must run before any spawning logic.
    MemoryManager.cleanupCreepMemory();

    // update exported lists of creeps by role
    this.harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    this.upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    this.builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    this.repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');

    // update creep memory (builders' target site, repairers' target structure, etc)
    MemoryManager.updateCreepMemory();

    if (CreepManager.canCreateHarvester(this.harvesters)) {
      CreepManager.createHarvester();
    } else if (CreepManager.canCreateBuilder(this.builders)) {
      CreepManager.createBuilder();
    } else if (CreepManager.canCreateUpgrader(this.upgraders)) {
      CreepManager.createUpgrader();
    } else if (CreepManager.canCreateRepairer(this.repairers)) {
      CreepManager.createRepairer();
    }

    CreepManager.harvestersGoToWork();
    CreepManager.upgradersGoToWork();
    CreepManager.buildersGoToWork();
    CreepManager.repairersGoToWork();
  }

}
