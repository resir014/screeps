import * as Inscribe from 'screeps-inscribe'

import { ENABLE_DEBUG_MODE } from '../../config/constants'
import * as Logger from '../../utils/logger'

export const enqueueSpawnRequest = (room: Room, queue: CreepSpawnQueue) => {
  const list = getSpawnQueue(room)
  list.push(queue)

  // sort by priority
  list.sort((a, b) => {
    if (a.priority < b.priority) return -1
    if (a.priority > b.priority) return 1
    return 0
  })

  for (const item of list) {
    if (ENABLE_DEBUG_MODE) {
      const out = [
        `[${Inscribe.color('SpawnQueue', 'skyblue')}]`,
        `[${Inscribe.color(room.name, 'hotpink')}]`,
        `R ${item.role} | P ${item.priority} | T ${item.target}`
      ]
      Logger.debug(out.join(' '))
    }
  }

  setSpawnQueue(room, list)
}

export const dequeueSpawnRequest = (room: Room) => {
  const list = getSpawnQueue(room)
  const item = list.shift()

  setSpawnQueue(room, list)
  return item
}

export const getSpawnQueue = (room: Room) => room.memory.queue

export const getQueueCount = (room: Room) => getSpawnQueue(room).length

export const setSpawnQueue = (room: Room, queue: CreepSpawnQueue[]) => {
  room.memory.queue = queue
}

export const filterSpawnQueueByCreepRole = (room: Room, role: string) =>
  room.memory.queue.filter((queue: CreepSpawnQueue) => queue.role === role)
