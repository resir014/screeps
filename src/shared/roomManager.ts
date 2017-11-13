import { runCreeps } from '../controllers/creepController'
import { refreshAvailableSources } from '../components/sources/sourceManager'
import { runSpawns } from '../components/spawns/spawnManager'
import { runTowers } from '../controllers/towerController'

import {
  initialiseRoomMemory,
  refreshMiningPositions,
  cleanupCreepMemory
} from './memoryManager'

export const runControlledRooms = (room: Room) => {
  // Memory cleanup tasks
  initialiseRoomMemory(room)
  refreshMiningPositions(room)
  cleanupCreepMemory(room)

  // Component initialisation tasks
  refreshAvailableSources(room)

  // For each tick, run managed creeps/structures
  runSpawns(room)
  runCreeps(room)
  runTowers(room)
}
