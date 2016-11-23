import * as StructureManager from "./../../structures/structureManager";
import * as creepActions from "../creepActions";

/**
 * Runs all creep actions.
 *
 * @export
 * @param {Creep} creep The current creep.
 */
export function run(creep: Creep) {
  let structures = StructureManager.loadStructures(creep.room);

  if (_.sum(this.creep.carry) > 0) {
    let structuresToRepair = _getWallsToRepair(structures);

    if (structuresToRepair) {
      if (this.creep.pos.isNearTo(structuresToRepair[0])) {
        this.creep.repair(structuresToRepair[0]);
      } else {
        this.moveTo(structuresToRepair[0]);
      }
    }
  } else {
    creepActions.tryRetrieveEnergy(creep);
  }
}

/**
 * Get an array of walls that needs repair.
 *
 * Returns `undefined` if there are no walls to be repaired.
 *
 * @param {Structure[]} structures The list of structures.
 * @returns {(Structure[] | undefined)} an array of walls to repair.
 */
function _getWallsToRepair(structures: Structure[]): Structure[] | undefined {

  let targets: Structure[] = structures.filter((structure: Structure) => {
    return ((structure.structureType === STRUCTURE_WALL) && structure.hits < 700000);
  });

  return targets;
}
