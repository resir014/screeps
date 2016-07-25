import { Config } from './../../config/config';

export namespace MineralManager {

  export let minerals: Mineral[];
  export let mineralCount: number = 0;

  /**
   * Initialization scripts for MineralManager namespace.
   *
   * @export
   * @param {Room} room The current room.
   */
  export function loadMinerals(room: Room) {
    minerals = room.find<Mineral>(FIND_MINERALS);
    mineralCount = _.size(minerals);

    if (Config.VERBOSE) {
      console.log('[MineralManager] ' + mineralCount + ' minerals found.');
    }
  }
}
