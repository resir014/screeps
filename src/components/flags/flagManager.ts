import { Config } from './../../config/config';
import { RoomManager } from './../rooms/roomManager';

export namespace FlagManager {

  export var flags: Flag[];
  export var flagNames: string[] = [];
  export var flagCount: number = 0;

  export function loadFlags(room: Room) {
    flags = room.find<Flag>(FIND_FLAGS);
    flagCount = _.size(flags);

    _loadFlagNames();

    if (Config.VERBOSE) {
      console.log('[FlagManager] ' + flagCount + ' flags found.');
    }
  }

  export function getFirstFlag(): Flag {
    return flags[flagNames[0]];
  }

  export function getFlag(name: string): Flag {
    return flags[name];
  }

  function _loadFlagNames(): void {
    for (let name in flags) {
      if (flags.hasOwnProperty(name)) {
        flagNames.push(name);
      }
    }
  }

}
