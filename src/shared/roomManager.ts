import { runCreeps } from '../components/creeps/creepManager'
import { refreshAvailableSources } from '../components/sources/sourceManager'
import { runSpawns } from '../components/spawns/spawnManager'
import { runTowers } from '../components/towers/towerManager'

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
