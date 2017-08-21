/**
 * Executes all Tower actions.
 *
 * @export
 * @param {Room} room
 */
export function runTowers(room: Room): void {
  const hostiles = room.find<Creep>(FIND_HOSTILE_CREEPS)
  const towers = room.find<Tower>(FIND_MY_STRUCTURES, {
    filter: (structure: Structure) => {
      return structure.structureType === STRUCTURE_TOWER
    }
  })

  if (hostiles.length > 0) {
    // let username: string = hostiles[0].owner.username;
    // Game.notify(`User ${username} spotted in room ${room}`);

    towers.forEach((tower: Tower) => {
      tower.attack(hostiles[0])
    })
  }
}
