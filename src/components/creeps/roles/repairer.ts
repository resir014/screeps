import { StructureManager } from './../../structures/structureManager';

export namespace Repairer {

  // TODO: refactor these over to getStructuresToRepair(). -r
  export let structures: Structure[];
  export let structureToRepair: Structure[];

  export let targetSource: Resource;
  export let targetContainer: Container;

  export function run(creep: Creep, room: Room): void {

    structures = StructureManager.structures;

    if (_.sum(creep.carry) > 0) {
      structureToRepair = structures.filter((structure: Structure) => {
        return ((structure.hits < (structure.hitsMax - (structure.hitsMax * 0.4)) && (structure.structureType !== STRUCTURE_WALL && structure.structureType !== STRUCTURE_RAMPART)));
      });

      if (structureToRepair.length == 0) {
        structureToRepair = structures.filter((structure: Structure) => {
          return ((structure.hits < (structure.hitsMax - (structure.hitsMax * 0.4)) && (structure.structureType !== STRUCTURE_WALL)));
        });
      }

      if (creep.pos.isNearTo(structureToRepair[0])) {
        creep.repair(structureToRepair[0]);
      } else {
        creep.moveTo(structureToRepair[0]);
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
