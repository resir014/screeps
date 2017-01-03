import * as StructureManager from "./../../structures/structureManager";
import * as creepActions from "../creepActions";

/**
 * Runs all creep actions.
 *
 * @export
 * @param {Creep} creep The current creep.
 */
export function run(creep: Creep) {
  let structures: Structure[] = StructureManager.loadStructures(creep.room);

  if (_.sum(creep.carry) > 0) {
    let structuresToRepair = _getStructuresToRepair(structures);

    if (structuresToRepair) {
      if (creep.pos.isNearTo(structuresToRepair[0])) {
        creep.repair(structuresToRepair[0]);
      } else {
        creepActions.moveTo(creep, structuresToRepair[0]);
      }
    }
  } else {
    creepActions.tryRetrieveEnergy(creep);
  }
}

/**
 * Get an array of structures that needs repair.
 *
 * This does *not* initially include defensive structures (walls, roads,
 * ramparts). If there are no such structures to be repaired, this expands to
 * include roads, then ramparts.
 *
 * Returns `undefined` if there are no structures to be repaired. This function
 * will never return a wall.
 *
 * @export
 * @param {Structure[]} structures The list of structures.
 * @returns {(Structure[] | undefined)} an array of structures to repair.
 */
function _getStructuresToRepair(structures: Structure[]): Structure[] | undefined {

  let targets: Structure[];

  // Initial search scope.
  targets = structures.filter((structure: Structure) => {
    return ((structure.hits < (structure.hitsMax - (structure.hitsMax * 0.1))
      && (structure.structureType !== STRUCTURE_WALL && structure.structureType !== STRUCTURE_ROAD
        && structure.structureType !== STRUCTURE_RAMPART)));
  });

  // If nothing is found, expand search to include roads.
  if (targets.length === 0) {
    targets = structures.filter((structure: Structure) => {
      return ((structure.hits < (structure.hitsMax - (structure.hitsMax * 0.1))
        && (structure.structureType !== STRUCTURE_WALL && structure.structureType !== STRUCTURE_RAMPART)));
    });
  }

  // If we still find nothing, expand search to ramparts.
  if (targets.length === 0) {
    targets = structures.filter((structure: Structure) => {
      return ((structure.hits < (structure.hitsMax - (structure.hitsMax * 0.1))
        && (structure.structureType !== STRUCTURE_WALL)));
    });
  }

  return targets;
}
