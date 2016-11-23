/**
 * Application bootstrap.
 * BEFORE CHANGING THIS FILE, make sure you read this:
 * http://support.screeps.com/hc/en-us/articles/204825672-New-main-loop-architecture
 */

import * as Config from "./config/config";
import * as MemoryManager from "./shared/memoryManager";
import * as JobManager from "./shared/jobManager";
import * as RoomManager from "./components/rooms/roomManager";
import * as SpawnManager from "./components/spawns/spawnManager";
import * as ControllerManager from "./components/controllers/controllerManager";
import * as SourceManager from "./components/sources/sourceManager";
import * as FlagManager from "./components/flags/flagManager";
import * as CreepManager from "./components/creeps/creepManager";
import * as ConstructionSiteManager from "./components/constructionSites/constructionSiteManager";
import * as StructureManager from "./components/structures/structureManager";
import * as TowerManager from "./components/towers/towerManager";

import { log } from "./utils/log";

// This code is executed only when Screeps system reloads your script.
// Use this bootstrap wisely. You can cache some of your stuff to save CPU
// You should extend prototypes before game loop in here.

RoomManager.load();

// specifies whether or not to use the new, experimental PathFinder object.
if (Config.USE_PATHFINDER) {
  PathFinder.use(true);
}

log.info("Scripts bootstraped");

/**
 * Screeps' system expects this "loop" method in main.js to run the application.
 * If we have this line, we can make sure that globals bootstrap and game loop work.
 * http://support.screeps.com/hc/en-us/articles/204825672-New-main-loop-architecture
 *
 * @export
 */
export function loop() {
  // Loop code starts here
  // This is executed every tick
  MemoryManager.loadMemory();

  // Check memory for null or out of bounds custom objects
  if (!MemoryManager.memory.uuid || MemoryManager.memory.uuid > 100) {
    MemoryManager.memory.uuid = 0;
  }

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
