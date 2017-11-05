import { controlledRoomJobs } from '../config/jobs'

/**
 * Refreshes the job assignment available in a room.
 *
 * @export
 * @param {Room} room The target room.
 */
export function refreshJobAssignments(room: Room): void {
  // Check if all job assignments are initialised properly.
  if (_.keys(room.memory.jobs).length !== _.keys(controlledRoomJobs).length) {
    const jobsToAdd = _.difference(controlledRoomJobs, _.keys(room.memory.jobs))
    for (const i in jobsToAdd) {
      if (jobsToAdd[i]) {
        room.memory.jobs[jobsToAdd[i]] = 0
      }
    }
  }
}

export function pushJobQueue(room: Room, queue: JobQueue): void {
  (room.memory as RoomMemory).queue.push(queue)
}
