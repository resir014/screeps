import * as Config from "./../../config/config";

export let minerals: Mineral[];
export let mineralCount: number = 0;

/**
 * Initialization scripts for MineralManager module.
 *
 * @export
 * @param {Room} room The current room.
 */
export function loadMinerals(room: Room) {
  minerals = room.find<Mineral>(FIND_MINERALS);
  mineralCount = _.size(minerals);

  if (Config.VERBOSE) {
    console.log("[MineralManager] " + mineralCount + " minerals found.");
  }
}
