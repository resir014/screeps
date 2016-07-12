import { Config } from './config/config';
import { MemoryManager } from './shared/memoryManager';
import { RoomManager } from './components/rooms/roomManager';
import { JobManager } from './components/jobs/jobManager';
import { SpawnManager } from './components/spawns/spawnManager';
import { ControllerManager } from './components/controllers/controllerManager';
import { SourceManager } from './components/sources/sourceManager';
import { FlagManager } from './components/flags/flagManager';
import { CreepManager } from './components/creeps/creepManager';
import { ConstructionSiteManager } from './components/constructionSites/constructionSiteManager';
import { StructureManager } from './components/structures/structureManager';
import { TowerManager } from './components/towers/towerManager';

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
    RoomManager.load();
  }

  export function loop() {
    // Loop code starts here
    // This is executed every tick
    MemoryManager.loadMemory();

    // garbage collection. must run before any spawning logic.
    MemoryManager.cleanupCreepMemory();

    // after garbage collection, we update all existing creep memory entries.
    // MemoryManager.updateCreepMemory();

    // specifies whether or not to use the new, experimental PathFinder object.
    PathFinder.use(true);

    RoomManager.rooms.forEach((room: Room) => {
      JobManager.load();
      SpawnManager.load(room);
      ControllerManager.load(room);
      FlagManager.load();
      SourceManager.load(room);
      ConstructionSiteManager.load(room);
      StructureManager.load(room);
      TowerManager.run(room);

      CreepManager.run(room);
    });
  }

}
