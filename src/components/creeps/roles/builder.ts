import * as Config from "../../../config/config";
import * as creepActions from "../creepActions";

import { log } from "../../../utils/log";

export let constructionSites: ConstructionSite[];
export let constructionSiteCount: number = 0;

/**
 * Runs all creep actions.
 *
 * @export
 * @param {Creep} creep The current creep.
 */
export function run(creep: Creep) {
  _loadConstructionSites(creep);

  if (creep.memory.building && creep.carry.energy === 0) {
    creep.memory.building = false;
  }

  if (!creep.memory.building && creep.carry.energy === creep.carryCapacity) {
    creep.memory.building = true;
  }

  if (creep.memory.building) {
    let targetConstructionSite = _getConstructionSite(constructionSites);

    if (targetConstructionSite) {
      if (creep.pos.isNearTo(targetConstructionSite)) {
        creep.build(targetConstructionSite);
      } else {
        creepActions.moveTo(creep, targetConstructionSite);
      }
    }

  } else {
    creepActions.tryRetrieveEnergy(creep);
  }
}

function _loadConstructionSites(creep: Creep) {
  constructionSites = creep.room.find<ConstructionSite>(FIND_CONSTRUCTION_SITES);
  constructionSiteCount = _.size(constructionSites);

  if (Config.ENABLE_DEBUG_MODE) {
    log.debug("[ConstructionSiteManager]", constructionSiteCount + " construction sites in room.");
  }
}

/**
 * Returns a prioritised list of available construction sites.
 *
 * @private
 * @param {ConstructionSite[]} targets
 * @returns {ConstructionSite}
 */
function _getConstructionSite(targets: ConstructionSite[]): ConstructionSite {
  let target: ConstructionSite | null = null;

  let roads: ConstructionSite[] = [];
  let extensions: ConstructionSite[] = [];
  let containers: ConstructionSite[] = [];
  let walls: ConstructionSite[] = [];
  let ramparts: ConstructionSite[] = [];
  let towers: ConstructionSite[] = [];
  let storages: ConstructionSite[] = [];

  roads = targets.filter((structure) => {
    return structure.structureType === STRUCTURE_ROAD;
  });

  extensions = targets.filter((structure) => {
    return structure.structureType === STRUCTURE_EXTENSION;
  });

  containers = targets.filter((structure) => {
    return structure.structureType === STRUCTURE_CONTAINER;
  });

  walls = targets.filter((structure) => {
    return structure.structureType === STRUCTURE_WALL;
  });

  ramparts = targets.filter((structure) => {
    return structure.structureType === STRUCTURE_RAMPART;
  });

  towers = targets.filter((structure) => {
    return structure.structureType === STRUCTURE_TOWER;
  });

  storages = targets.filter((structure) => {
    return structure.structureType === STRUCTURE_STORAGE;
  });

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
