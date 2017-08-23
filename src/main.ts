import { USE_PROFILER } from './config/config'
import { Orchestrator } from './core/orchestrator'
import { initialiseRooms } from './room/roomManager'
import { checkOutOfBoundsMemory } from './shared/memoryManager'

import { log, initLoggerMemory } from './lib/logger'
// uncomment the following line if you want to use the profiler
import * as Profiler from 'lib/Profiler'
import { loadCreepPrototypes } from './prototypes/Creep'
import { loadStructureSpawnPrototypes } from './prototypes/StructureSpawn'

// Any code written outside the `loop()` method is executed only when the
// Screeps system reloads your script.
// Use this bootstrap wisely. You can cache some of your stuff to save CPU.
// You should extend prototypes before the game loop executes here.

// Initialise logger memory.
initLoggerMemory()

// uncomment the following line if you want to use the profiler
// see the documentation https://github.com/screepers/screeps-typescript-profiler
global.Profiler = Profiler.init()

// Prototype extensions
loadCreepPrototypes()
loadStructureSpawnPrototypes()

global.Orchestrator = new Orchestrator()

log.info(`loading revision: ${__REVISION__}`)

function mloop(): void {
  // Check memory for null or out of bounds custom objects
  checkOutOfBoundsMemory()

  // Initialise all controlled rooms.
  initialiseRooms()
}

/**
 * Screeps system expects this "loop" method in main.js to run the
 * application. If we have this line, we can be sure that the globals are
 * bootstrapped properly and the game loop is executed.
 * http://support.screeps.com/hc/en-us/articles/204825672-New-main-loop-architecture
 *
 * @export
 */
export const loop = !USE_PROFILER ? mloop : mloop
