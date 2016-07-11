import { Config } from './../../config/config';

export namespace RoomManager {

  export let rooms: Room[] = [];
  export let roomNames: string[] = [];

  export function loadRooms() {
    for (let room in Game.rooms) {
      rooms.push(Game.rooms[room]);
    }

    _loadRoomNames();

    if (Config.VERBOSE) {
      let count = _.size(rooms);
      console.log('[RoomManager] ' + count + ' rooms found.');
    }
  }

  export function getFirstRoom(): Room {
    return rooms[roomNames[0]];
  }

  function _loadRoomNames() {
    for (let roomName in rooms) {
      if (rooms.hasOwnProperty(roomName)) {
        roomNames.push(roomName);
      }
    }
  }

}
