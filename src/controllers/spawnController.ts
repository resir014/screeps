import * as Inscribe from 'screeps-inscribe'
import { ENABLE_DEBUG_MODE } from '../config/constants'
import * as Logger from '../utils/logger'

import { getSpawnsThatArentSpawning, spawnCreepFromQueue } from '../components/spawns/spawnManager'

export const runSpawns = (room: Room) => {
  const spawns = getSpawnsThatArentSpawning(room)

  for (const spawn of spawns) {
    if (ENABLE_DEBUG_MODE) {
      const out = [
        `[${Inscribe.color('CreepManager', 'skyblue')}]`,
        `[${Inscribe.color(room.name, 'hotpink')}]`,
        `Spawning from: ${spawn.name}`
      ]
      Logger.debug(out.join(' '))
    }

    spawnCreepFromQueue(spawn, room)
  }
}
