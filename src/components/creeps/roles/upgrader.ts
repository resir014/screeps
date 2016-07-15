export namespace Upgrader {

  export let targetSource: Resource;
  export let targetContainer: Container;

  export function run(creep: Creep, room: Room): void {
    if (typeof creep.memory['upgrading'] === 'undefined') {
      creep.memory['upgrading'] = false;
    }

    if (creep.memory['upgrading'] && creep.carry.energy === 0) {
      creep.memory['upgrading'] = false;
    }

    if (!creep.memory['upgrading'] && creep.carry.energy === creep.carryCapacity) {
      creep.memory['upgrading'] = true;
    }


    if (creep.memory['upgrading']) {
      if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
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
  }

}
