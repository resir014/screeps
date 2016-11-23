import * as CreepManager from "./components/creeps/creepManager";
import * as SourceManager from "./components/sources/sourceManager";
import * as TowerManager from "./components/towers/towerManager";
import * as Config from "./config/config";
import * as JobManager from "./shared/jobManager";
import * as MemoryManager from "./shared/memoryManager";

import { log } from "./utils/log";

// Any code written outside the `loop()` method is executed only when the
// Screeps system reloads your script.
// Use this bootstrap wisely. You can cache some of your stuff to save CPU.
// You should extend prototypes before the game loop executes here.

if (Config.USE_PATHFINDER) {
  PathFinder.use(true);
}

log.info("Scripts bootstrapped.");

/**
 * Screeps system expects this "loop" method in main.js to run the
 * application. If we have this line, we can be sure that the globals are
 * bootstrapped properly and the game loop is executed.
 * http://support.screeps.com/hc/en-us/articles/204825672-New-main-loop-architecture
 *
 * @export
 */
export function loop() {
  // Check memory for null or out of bounds custom objects
  MemoryManager.checkOutOfBounds();

  // For each room, load the state and run functionality.
  for (let i in Game.rooms) {
    let room: Room = Game.rooms[i];

    // Memory cleanup tasks
    MemoryManager.refreshMiningPositions(room);
    MemoryManager.cleanupCreepMemory(room);
    JobManager.refreshJobs(room);

    // Component initialisation tasks
    SourceManager.refreshAvailableSources(room);

    // For each tick, run managed creeps/structures.
    CreepManager.run(room);
    TowerManager.run(room);
  }
}
