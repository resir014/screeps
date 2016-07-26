import * as Config from "./../../config/config";
import * as RoomManager from "./../rooms/roomManager";

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

  if (Config.VERBOSE) {
    console.log("[ConstructionSiteManager] " + constructionSiteCount + " construction sites in room.");
  }
}
