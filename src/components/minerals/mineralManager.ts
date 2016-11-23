import { log } from "../../utils/log";

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

  log.info("[MineralManager] " + mineralCount + " minerals found.");
}
