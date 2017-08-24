import * as Config from './config/config'
import { Orchestrator } from './core/orchestrator'
import { initialiseRooms } from './room/roomManager'
import { checkOutOfBoundsMemory } from './shared/memoryManager'

import * as Inscribe from './lib/Inscribe'
import { log } from './utils/logger'
import { loadCreepPrototypes } from './prototypes/Creep'
import { loadStructureSpawnPrototypes } from './prototypes/StructureSpawn'

// Any code written outside the `loop()` method is executed only when the
// Screeps system reloads your script.
// Use this bootstrap wisely. You can cache some of your stuff to save CPU.
// You should extend prototypes before the game loop executes here.

// initialise all CLI objects
global.Orchestrator = new Orchestrator()
global.log = log
global.config = Config
Inscribe.init()

// Prototype extensions
loadCreepPrototypes()
loadStructureSpawnPrototypes()

log.info(`[${Inscribe.color('main', 'skyblue')}] loading revision: ${__REVISION__}`)

/**
 * Screeps system expects this "loop" method in main.js to run the
 * application. If we have this line, we can be sure that the globals are
 * bootstrapped properly and the game loop is executed.
 * http://support.screeps.com/hc/en-us/articles/204825672-New-main-loop-architecture
 *
 * @export
 */
export function loop(): void {
  // Check memory for null or out of bounds custom objects
  checkOutOfBoundsMemory()

  // Initialise all controlled rooms.
  initialiseRooms()
}
