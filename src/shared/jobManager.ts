import { controlledRoomJobs } from '../config/jobs'

/**
 * Refreshes the job assignment available in a room.
 *
 * @todo If `manualJobControl` is set to `false` in the room memory, it's
 * going to invoke a method which will ~automagically~ define job assignments
 * based on some parameters. We don't even have that function yet.
 *
 * @export
 * @param {Room} room The target room.
 */
export function refreshJobAssignments(room: Room): void {
  // Check if all job assignments are initialised properly.
  if (_.keys(room.memory.jobs).length !== _.keys(controlledRoomJobs).length) {
    const jobsToAdd = _.difference(controlledRoomJobs, _.keys(room.memory.jobs))
    for (const i in jobsToAdd) {
      room.memory.jobs[jobsToAdd[i]] = 0
    }
  }
}
