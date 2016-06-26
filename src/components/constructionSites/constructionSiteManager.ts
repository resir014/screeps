import { Config } from './../../config/config';
import { RoomManager } from './../rooms/roomManager';

export namespace ConstructionSiteManager {

  export var constructionSites: ConstructionSite;
  export var constructionSiteCount: number = 0;

  export function loadConstructionSites() {
    this.constructionSites = RoomManager.getFirstRoom().find(FIND_CONSTRUCTION_SITES);
    this.constructionSiteCount = _.size(this.constructionSites);

    if (Config.VERBOSE) {
      console.log('[ConstructionSiteManager] ' + this.constructionSiteCount + ' construction sites in room.');
    }
  }

  export function getFirstConstructionSite(): ConstructionSite {
    return this.constructionSites[0];
  }

}
