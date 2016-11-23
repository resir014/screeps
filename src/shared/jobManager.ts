/**
 * Iterates through a room and check its job entries for out-of-bounds objects.
 *
 * @export
 * @param {Room} room The current room.
 */
export function refreshJobs(room: Room) {
  // Check if the `jobs` memort object is null
  if (!Memory.rooms[room.name].jobs) {
    Memory.rooms[room.name].jobs = {};
  }

  // Initialise all job entries
  if (!Memory.rooms[room.name].jobs.haulerJobs) {
    Memory.rooms[room.name].jobs.haulerJobs = 0;
  }
  if (!Memory.rooms[room.name].jobs.sourceMiningJobs) {
    Memory.rooms[room.name].jobs.sourceMiningJobs = 0;
  }
  if (!Memory.rooms[room.name].jobs.upgraderJobs) {
    Memory.rooms[room.name].jobs.upgraderJobs = 0;
  }
  if (!Memory.rooms[room.name].jobs.builderJobs) {
    Memory.rooms[room.name].jobs.builderJobs = 0;
  }
  if (!Memory.rooms[room.name].jobs.repairJobs) {
    Memory.rooms[room.name].jobs.repairJobs = 0;
  }
  if (!Memory.rooms[room.name].jobs.wallRepairJobs) {
    Memory.rooms[room.name].jobs.wallRepairJobs = 0;
  }
}
