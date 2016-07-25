/**
 * Application bootstrap.
 * BEFORE CHANGING THIS FILE, make sure you read this:
 * http://support.screeps.com/hc/en-us/articles/204825672-New-main-loop-architecture
 */

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

// This code is executed only when Screeps system reloads your script.
// Use this bootstrap wisely. You can cache some of your stuff to save CPU
// You should extend prototypes before game loop in here.

RoomManager.load();

/**
 * Screeps" system expects this "loop" method in main.js to run the application.
 * If we have this line, we can make sure that globals bootstrap and game loop work.
 * http://support.screeps.com/hc/en-us/articles/204825672-New-main-loop-architecture
 *
 * @export
 */
export function loop() {
  // Loop code starts here
  // This is executed every tick
  MemoryManager.loadMemory();

  // specifies whether or not to use the new, experimental PathFinder object.
  PathFinder.use(true);

  RoomManager.rooms.forEach((room: Room) => {
    // initialise all memory items
    MemoryManager.refreshMiningPositions(room);

    // garbage collection. must run before any spawning logic.
    MemoryManager.cleanupCreepMemory(room);

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
