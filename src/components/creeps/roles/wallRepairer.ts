import { StructureManager } from './../../structures/structureManager';

export namespace WallRepairer {

  // TODO: refactor these over to getDefensiveStructuresToRepair(). -r
  export let structures: Structure[];
  export let structureToRepair: Structure[];

  export let targetSource: Resource;
  export let targetContainer: Container;

  export function run(creep: Creep, room: Room): void {

    structures = StructureManager.structures;

    if (_.sum(creep.carry) > 0) {
      structureToRepair = structures.filter(function (object) {
        return ((object.structureType === STRUCTURE_WALL || object.structureType === STRUCTURE_RAMPART) && object.hits < 700000);
      });

      if (creep.pos.isNearTo(structureToRepair[0])) {
        creep.repair(structureToRepair[0]);
      } else {
        creep.moveTo(structureToRepair[0]);
      }
    } else {
      targetSource = creep.pos.findClosestByPath<Resource>(FIND_DROPPED_RESOURCES);

      if (targetSource != null) {
        if (creep.pos.isNearTo(targetSource)) {
          creep.pickup(targetSource);
        } else {
          creep.moveTo(targetSource);
        }
      } else {
        targetContainer = creep.pos.findClosestByPath<Container>(FIND_STRUCTURES, {
          filter: ((structure) => {
            if (structure.structureType == STRUCTURE_CONTAINER) {
              let container = <Container>structure;
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

}
