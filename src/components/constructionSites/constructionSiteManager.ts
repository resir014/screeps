import { Config } from './../../config/config';
import { RoomManager } from './../rooms/roomManager';

export namespace ConstructionSiteManager {

  export let constructionSites: ConstructionSite[];
  export let constructionSiteCount: number = 0;

  export let roads: ConstructionSite[] = [];
  export let extensions: ConstructionSite[] = [];
  export let containers: ConstructionSite[] = [];
  export let walls: ConstructionSite[] = [];
  export let ramparts: ConstructionSite[] = [];
  export let towers: ConstructionSite[] = [];
  export let storages: ConstructionSite[] = [];

  /**
   * Initialization script for ConstructionSiteManager namespace.
   *
   * @export
   * @param {Room} room
   */
  export function load(room: Room) {
    constructionSites = room.find<ConstructionSite>(FIND_CONSTRUCTION_SITES);
    constructionSiteCount = _.size(constructionSites);

    _loadStructureCounts();

    if (Config.VERBOSE) {
      console.log('[ConstructionSiteManager] ' + constructionSiteCount + ' construction sites in room.');
    }
  }

  /**
   * Returns the first construction site in the list.
   *
   * @return {ConstructionSite}
   */
  export function getFirstConstructionSite(): ConstructionSite {
    return constructionSites[0];
  }

  /**
   * Returns a prioritised list of  available construction sites.
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
      target = constructionSites[0];
    }

    return target;
  }

  /**
   * Returns all construction site and pushes them to each structure type's
   * corresponding arrays.
   */
  function _loadStructureCounts(): void {
    roads = constructionSites.filter((structure) => {
      return structure.structureType === STRUCTURE_ROAD;
    });

    extensions = constructionSites.filter((structure) => {
      return structure.structureType === STRUCTURE_EXTENSION;
    });

    containers = constructionSites.filter((structure) => {
      return structure.structureType === STRUCTURE_CONTAINER;
    });

    walls = constructionSites.filter((structure) => {
      return structure.structureType === STRUCTURE_WALL;
    });

    ramparts = constructionSites.filter((structure) => {
      return structure.structureType === STRUCTURE_RAMPART;
    });

    towers = constructionSites.filter((structure) => {
      return structure.structureType === STRUCTURE_TOWER;
    });

    storages = constructionSites.filter((structure) => {
      return structure.structureType === STRUCTURE_STORAGE;
    });
  }

}
