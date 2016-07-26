import * as ConstructionSiteManager from "../../constructionSites/constructionSiteManager";
import { CreepAction } from "../creepAction";

/**
 * Collects energy and uses it to build a construction site.
 *
 * @export
 * @class Builder
 * @extends {CreepAction}
 */
export class Builder extends CreepAction {
  private room: Room;
  private constructionSites: ConstructionSite[] = ConstructionSiteManager.constructionSites;

  /**
   * Creates an instance of Builder.
   *
   * @param {Creep} creep The current creep.
   * @param {Room} room The current room.
   */
  constructor(creep: Creep, room: Room) {
    super(creep);
    this.constructionSites = ConstructionSiteManager.constructionSites;
    this.room = room;
  }

  /**
   * Run all Builder actions.
   */
  public run(): void {
    if (this.creep.memory["building"] && this.creep.carry.energy === 0) {
      this.creep.memory["building"] = false;
    }

    if (!this.creep.memory.building && this.creep.carry.energy === this.creep.carryCapacity) {
      this.creep.memory["building"] = true;
    }

    if (this.creep.memory["building"]) {

      let targetConstructionSite = this.getConstructionSite(this.constructionSites);

      if (targetConstructionSite) {
        if (this.creep.pos.isNearTo(targetConstructionSite)) {
          this.creep.build(targetConstructionSite);
        } else {
          this.moveTo(targetConstructionSite);
        }
      }

    } else {
      let targetSource = this.creep.pos.findClosestByPath<Resource>(FIND_DROPPED_RESOURCES);

      if (targetSource) {
        if (this.creep.pos.isNearTo(targetSource)) {
          this.creep.pickup(targetSource);
        } else {
          this.moveTo(targetSource);
        }
      } else {
        let targetContainer = this.creep.pos.findClosestByPath<Container>(FIND_STRUCTURES, {
          filter: ((structure: Structure) => {
            if (structure.structureType === STRUCTURE_CONTAINER) {
              let container = <Container>structure;
              if (_.sum(container.store) > (500)) {
                return container;
              }
            }
          })
        });

        if (targetContainer) {
          if (this.creep.pos.isNearTo(targetContainer)) {
            this.creep.withdraw(targetContainer, RESOURCE_ENERGY);
          } else {
            this.moveTo(targetContainer);
          }
        }
      }
    }
  }

  /**
   * Returns a prioritised list of available construction sites.
   *
   * @private
   * @param {ConstructionSite[]} constructionSites
   * @returns {ConstructionSite}
   */
  private getConstructionSite(constructionSites: ConstructionSite[]): ConstructionSite {
    let target: ConstructionSite = null;

    let roads: ConstructionSite[] = [];
    let extensions: ConstructionSite[] = [];
    let containers: ConstructionSite[] = [];
    let walls: ConstructionSite[] = [];
    let ramparts: ConstructionSite[] = [];
    let towers: ConstructionSite[] = [];
    let storages: ConstructionSite[] = [];

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

}
