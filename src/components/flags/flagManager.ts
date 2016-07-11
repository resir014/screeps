import { Config } from './../../config/config';
import { RoomManager } from './../rooms/roomManager';

export namespace FlagManager {

  export let flags: { [flagName: string]: Flag };
  export let flagNames: string[] = [];
  export let flagCount: number = 0;

  export function loadFlags() {
    flags = Game.flags;
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
