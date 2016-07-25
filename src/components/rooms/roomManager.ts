import * as Config from './../../config/config';

export let rooms: Room[] = [];
export let roomNames: string[] = [];

/**
 * Initialization scripts for the RoomManager module.
 *
 * @export
 */
export function load() {
  for (let room in Game.rooms) {
    rooms.push(Game.rooms[room]);
  }

  _loadRoomNames();

  if (Config.VERBOSE) {
    let count = _.size(rooms);
    console.log('[RoomManager] ' + count + ' rooms found.');
  }
}

/**
 * Returns the first room from the list.
 *
 * @export
 * @returns {Room}
 */
export function getFirstRoom(): Room {
  return rooms[roomNames[0]];
}

/**
 * Loads all Room names and pushes them into an array.
 */
function _loadRoomNames(): void {
  for (let roomName in rooms) {
    if (rooms.hasOwnProperty(roomName)) {
      roomNames.push(roomName);
    }
  }
}
