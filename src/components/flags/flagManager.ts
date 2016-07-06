import { Config } from './../../config/config';
import { RoomManager } from './../rooms/roomManager';

export namespace FlagManager {

  export var flags: Flag[];
  export var flagNames: string[];
  export var flagCount: number = 0;

  export function loadFlags() {
    this.flags = Game.flags;
    this.flagCount = _.size(this.flags);

    _loadFlagNames();

    if (Config.VERBOSE) {
      console.log('[FlagManager] ' + this.flagCount + ' flags found.');
    }
  }

  export function getFirstFlag(): Flag {
    return this.flags[this.flagNames[0]];
  }

  function _loadFlagNames(): void {
    for (let name in flags) {
      if (flags.hasOwnProperty(name)) {
        flagNames.push(name);
      }
    }
  }

}
