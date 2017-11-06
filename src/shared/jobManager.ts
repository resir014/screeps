import { controlledRoomJobs, bodyTemplates } from '../config/jobs'
import { getCreepsInRoom, isShortCreepRole } from '../components/creeps/creepManager'

/**
 * Refreshes the job assignment available in a room.
 *
 * @export
 * @param {Room} room The target room.
 */
export function refreshJobAssignments(room: Room): void {
  //
}

export const filterJobQueueByCreepRole = (room: Room, role: string) =>
  room.memory.queue.filter((queue: CreepSpawnQueue) => queue.role === role)
