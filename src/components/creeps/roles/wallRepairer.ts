import * as StructureManager from "./../../structures/structureManager";
import { CreepAction } from "../creepAction";

/**
 * Collects energy and uses it to repair any walls that needs repair.
 *
 * @export
 * @class WallRepairer
 * @extends {CreepAction}
 */
export class WallRepairer extends CreepAction {

  private room: Room;
  private structures: Structure[];

  /**
   * Creates an instance of WallRepairer.
   *
   * @param {Creep} creep The current creep.
   * @param {Room} room The current room.
   */
  constructor(creep: Creep, room: Room) {
    super(creep);
    this.room = room;
    this.structures = StructureManager.structures;
  }

  /**
   * Run all WallRepairer actions.
   */
  public run(): void {

    if (_.sum(this.creep.carry) > 0) {
      let structuresToRepair = this.getWallsToRepair(this.structures);

      if (structuresToRepair) {
        if (this.creep.pos.isNearTo(structuresToRepair[0])) {
          this.creep.repair(structuresToRepair[0]);
        } else {
          this.moveTo(structuresToRepair[0]);
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
              let container: Container = <Container>structure;
              if (_.sum(container.store) > (500)) {
                return container;
              }
            }
          })
        });

        if (this.creep.pos.isNearTo(targetContainer)) {
          this.creep.withdraw(targetContainer, RESOURCE_ENERGY);
        } else {
          this.moveTo(targetContainer);
        }
      }
    }
  }

  /**
   * Get an array of walls that needs repair.
   *
   * Returns `undefined` if there are no walls to be repaired.
   *
   * @export
   * @param {Structure[]} structures The list of structures.
   * @returns {Structure[]} an array of walls to repair.
   */
  private getWallsToRepair(structures: Structure[]): Structure[] {

    let targets: Structure[] = structures.filter((structure: Structure) => {
      return ((structure.structureType === STRUCTURE_WALL) && structure.hits < 700000);
    });

    return targets;
  }

}
