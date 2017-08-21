import { runCreeps } from '../components/creeps/creepManager'
import { refreshAvailableSources } from '../components/sources/sourceManager'
import { runTowers } from '../components/towers/towerManager'
import { refreshJobAssignments } from '../shared/jobManager'
import {
  initialiseRoomMemory,
  refreshMiningPositions,
  cleanupCreepMemory
} from '../shared/memoryManager'

/**
 * Initialise all controlled rooms.
 *
 * @export
 */
export function initialiseRooms() {
  _.each(Game.rooms, (room: Room) => {
    // Memory cleanup tasks
    initialiseRoomMemory(room)
    refreshMiningPositions(room)
    cleanupCreepMemory(room)
    refreshJobAssignments(room)

    // Component initialisation tasks
    refreshAvailableSources(room)

    // For each tick, run managed creeps/structures
    runCreeps(room)
    runTowers(room)
  })
}
