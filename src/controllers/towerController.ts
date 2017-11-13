import * as TowerManager from '../components/towers/towerManager'

/**
 * Executes all Tower actions.
 *
 * @export
 * @param {Room} room
 */
export function runTowers(room: Room): void {
  const hostiles = room.find<Creep>(FIND_HOSTILE_CREEPS)
  const towers = TowerManager.getTowersInRoom(room)

  if (hostiles.length > 0) {
    // let username: string = hostiles[0].owner.username;
    // Game.notify(`User ${username} spotted in room ${room}`);

    towers.forEach((tower: StructureTower) => {
      tower.attack(hostiles[0])
    })
  }
}
