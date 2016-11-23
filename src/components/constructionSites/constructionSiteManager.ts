import { log } from "../../utils/log";

export let constructionSites: ConstructionSite[];
export let constructionSiteCount: number = 0;

/**
 * Initialization script for ConstructionSiteManager module.
 *
 * @export
 * @param {Room} room
 */
export function load(room: Room) {
  constructionSites = room.find<ConstructionSite>(FIND_CONSTRUCTION_SITES);
  constructionSiteCount = _.size(constructionSites);

  log.info("[ConstructionSiteManager]", constructionSiteCount + " construction sites in room.");
}
