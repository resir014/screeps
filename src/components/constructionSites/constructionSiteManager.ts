import { Config } from './../../config/config';
import { RoomManager } from './../rooms/roomManager';

export namespace ConstructionSiteManager {

  export var constructionSites: ConstructionSite[];
  export var constructionSiteCount: number = 0;

  export var roads: ConstructionSite[] = [];
  export var extensions: ConstructionSite[] = [];
  export var containers: ConstructionSite[] = [];
  export var walls: ConstructionSite[] = [];
  export var ramparts: ConstructionSite[] = [];
  export var towers: ConstructionSite[] = [];
  export var storages: ConstructionSite[] = [];

  export function loadConstructionSites() {
    constructionSites = RoomManager.getFirstRoom().find<ConstructionSite>(FIND_CONSTRUCTION_SITES);
    constructionSiteCount = _.size(constructionSites);

    _loadStructureCounts();

    if (Config.VERBOSE) {
      console.log('[ConstructionSiteManager] ' + constructionSiteCount + ' construction sites in room.');
    }
  }

  /**
   * Retrieves the first construction site in the list.
   *
   * @return {ConstructionSite}
   */
  export function getFirstConstructionSite(): ConstructionSite {
    return constructionSites[0];
  }

  /**
   * Retrieves a prioritised list of  available construction sites.
   *
   * @export
   * @return {ConstructionSite}
   */
  export function getConstructionSite(): ConstructionSite {
    let target: ConstructionSite = null;

    if (roads.length > 0) {
      target = roads[0];
    } else if (extensions.length > 0) {
      target = extensions[0];
    } else if (containers.length > 0) {
      target = containers[0];
    } else if (walls.length > 0) {
      target = walls[0];
    } else if (ramparts.length > 0) {
      target = ramparts[0];
    } else if (towers.length > 0) {
      target = towers[0];
    } else if (storages.length > 0) {
      target = storages[0];
    } else {
      let rand = Math.round(Math.random() * (constructionSites.length - 1) + 1);
      target = constructionSites[rand];
    }

    return target;
  }

  function _loadStructureCounts(): void {
    roads = constructionSites.filter((constructionSite: ConstructionSite) => {
      return constructionSite.structureType === STRUCTURE_ROAD;
    });

    if (roads.length === 0) {
      extensions = constructionSites.filter((constructionSite: ConstructionSite) => {
        return constructionSite.structureType === STRUCTURE_EXTENSION;
      });
    }

    if (extensions.length === 0) {
      containers = constructionSites.filter((constructionSite: ConstructionSite) => {
        return constructionSite.structureType === STRUCTURE_CONTAINER;
      });
    }

    if (containers.length === 0) {
      walls = constructionSites.filter((constructionSite: ConstructionSite) => {
        return constructionSite.structureType === STRUCTURE_WALL;
      });
    }

    if (walls.length === 0){
      ramparts = constructionSites.filter((constructionSite: ConstructionSite) => {
        return constructionSite.structureType === STRUCTURE_RAMPART;
      });
    }

    if (ramparts.length === 0) {
      towers = constructionSites.filter((constructionSite: ConstructionSite) => {
        return constructionSite.structureType === STRUCTURE_TOWER;
      });
    }

    if (towers.length === 0) {
      storages = constructionSites.filter((constructionSite: ConstructionSite) => {
        return constructionSite.structureType === STRUCTURE_STORAGE;
      });
    }
  }

}
