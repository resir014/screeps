import * as creepActions from "../creepActions";

/**
 * Runs all creep actions.
 *
 * @export
 * @param {Creep} creep The current creep.
 */
export function run(creep: Creep) {
  let roomController: StructureController | undefined = creep.room.controller;

  if (!creep.memory.upgrading) {
    creep.memory.upgrading = false;
  }
  if (creep.memory.upgrading && creep.carry.energy === 0) {
    creep.memory.upgrading = false;
  }
  if (!creep.memory.upgrading && creep.carry.energy === creep.carryCapacity) {
    creep.memory.upgrading = true;
  }

  if (creep.memory.upgrading) {
    if (roomController && creep.upgradeController(roomController) === ERR_NOT_IN_RANGE) {
      creepActions.moveTo(creep, roomController);
    }
  } else {
    let targetSource = creep.pos.findClosestByPath<Resource>(FIND_DROPPED_RESOURCES);

    if (targetSource) {
      if (creep.pos.isNearTo(targetSource)) {
        creep.pickup(targetSource);
      } else {
        creepActions.moveToResource(creep, targetSource);
      }
    } else {
      creepActions.tryRetrieveEnergy(creep);
    }
  }
}
