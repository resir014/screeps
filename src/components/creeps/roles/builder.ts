import {ConstructionSiteManager} from "../../constructionSites/constructionSiteManager"

export namespace Builder {

  export let constructionSites: ConstructionSite[] = ConstructionSiteManager.constructionSites;

  export let targetSource: Resource;
  export let targetContainer: Container;
  export let targetConstructionSite: ConstructionSite;

  /**
   * Run all Builder actions.
   *
   * @export
   * @param {Creep} creep The current creep.
   * @param {Room} room The current room.
   */
  export function run(creep: Creep, room: Room): void {
    if (creep.memory['building'] && creep.carry.energy === 0) {
      creep.memory['building'] = false;
    }

    if (!creep.memory.building && creep.carry.energy === creep.carryCapacity) {
      creep.memory['building'] = true;
    }

    if (creep.memory['building']) {

      targetConstructionSite = ConstructionSiteManager.getConstructionSite()
        ? ConstructionSiteManager.getConstructionSite()
        : null;

      if (targetConstructionSite) {
        if (creep.pos.isNearTo(targetConstructionSite)) {
          creep.build(targetConstructionSite);
        } else {
          creep.moveTo(targetConstructionSite);
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
          filter: ((structure) => {
            if (structure.structureType == STRUCTURE_CONTAINER) {
              let container = <Container>structure;
              if (_.sum(container.store) > (500)) {
                return container;
              }
            }
          })
        });

        if (targetContainer) {
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
