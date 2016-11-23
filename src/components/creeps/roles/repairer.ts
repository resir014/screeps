import * as StructureManager from "./../../structures/structureManager";
import { CreepAction } from "../creepAction";

/**
 * Collects energy and uses it to repair any structures that needs repair.
 *
 * @export
 * @class Repairer
 * @extends {CreepAction}
 */
export class Repairer extends CreepAction {

  private room: Room;
  private structures: Structure[];

  /**
   * Creates an instance of Repairer.
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
   * Run all Repairer actions.
   */
  public run(): void {

    if (_.sum(this.creep.carry) > 0) {
      let structuresToRepair = this.getStructuresToRepair(this.structures);

      if (structuresToRepair) {
        if (this.creep.pos.isNearTo(structuresToRepair[0])) {
          this.creep.repair(structuresToRepair[0]);
        } else {
          this.moveTo(structuresToRepair[0]);
        }
      }
    } else {
      this.tryRetrieveEnergy();
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
   * @returns {Structure[]} an array of structures to repair.
   */
  private getStructuresToRepair(structures: Structure[]): Structure[] {

    let targets: Structure[];

    // Initial search scope.
    targets = structures.filter((structure: Structure) => {
      return ((structure.hits < (structure.hitsMax - (structure.hitsMax * 0.4))
        && (structure.structureType !== STRUCTURE_WALL && structure.structureType !== STRUCTURE_ROAD
          && structure.structureType !== STRUCTURE_RAMPART)));
    });

    // If nothing is found, expand search to include roads.
    if (targets.length === 0) {
      targets = structures.filter((structure: Structure) => {
        return ((structure.hits < (structure.hitsMax - (structure.hitsMax * 0.4))
          && (structure.structureType !== STRUCTURE_WALL && structure.structureType !== STRUCTURE_RAMPART)));
      });
    }

    // If we still find nothing, expand search to ramparts.
    if (targets.length === 0) {
      targets = structures.filter((structure: Structure) => {
        return ((structure.hits < (structure.hitsMax - (structure.hitsMax * 0.4))
          && (structure.structureType !== STRUCTURE_WALL)));
      });
    }

    return targets;
  }

}
