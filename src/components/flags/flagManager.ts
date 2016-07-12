import { Config } from './../../config/config';
import { RoomManager } from './../rooms/roomManager';

export namespace FlagManager {

  export let flags: { [flagName: string]: Flag };
  export let flagNames: string[] = [];
  export let flagCount: number = 0;

  /**
   * Initialization script for FlagManager namespace.
   *
   * @export
   */
  export function load() {
    flags = Game.flags;
    flagCount = _.size(flags);

    _loadFlagNames();

    if (Config.VERBOSE) {
      console.log('[FlagManager] ' + flagCount + ' flags found.');
    }
  }

  /**
   * Returns the first `Flag` on the list.
   *
   * @export
   * @returns {Flag}
   */
  export function getFirstFlag(): Flag {
    return flags[flagNames[0]];
  }

  /**
   * Returns a `Flag` with a specific name.
   *
   * @export
   * @param {string} name
   * @returns {Flag}
   */
  export function getFlag(name: string): Flag {
    return flags[name];
  }

  /**
   * Loads the names of all flags and pushes them into an array.
   */
  function _loadFlagNames(): void {
    for (let name in flags) {
      if (flags.hasOwnProperty(name)) {
        flagNames.push(name);
      }
    }
  }

}
