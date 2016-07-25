import * as StructureManager from './../../structures/structureManager';

export let structuresToRepair: Structure[];

export let targetSource: Resource;
export let targetContainer: Container;

/**
 * Run all WallRepairer actions.
 *
 * @export
 * @param {Creep} creep The current creep.
 * @param {Room} room The current room.
 */
export function run(creep: Creep, room: Room): void {

  if (_.sum(creep.carry) > 0) {
    structuresToRepair = StructureManager.getWallsToRepair();

    if (structuresToRepair) {
      if (creep.pos.isNearTo(structuresToRepair[0])) {
        creep.repair(structuresToRepair[0]);
      } else {
        creep.moveTo(structuresToRepair[0]);
      }
    }
  } else {
    targetSource = creep.pos.findClosestByPath<Resource>(FIND_DROPPED_RESOURCES);

    if (targetSource) {
      if (creep.pos.isNearTo(targetSource)) {
        creep.pickup(targetSource);
      } else {
        creep.moveTo(targetSource);
      }
    } else {
      targetContainer = creep.pos.findClosestByPath<Container>(FIND_STRUCTURES, {
        filter: ((structure: Structure) => {
          if (structure.structureType == STRUCTURE_CONTAINER) {
            let container: Container = <Container>structure;
            if (_.sum(container.store) > (500)) {
              return container;
            }
          }
        })
      });

      if (creep.pos.isNearTo(targetContainer)) {
        creep.withdraw(targetContainer, RESOURCE_ENERGY);
      } else {
        creep.moveTo(targetContainer);
      }
    }
  }
}
