import * as StructureManager from '../../structures/structureManager'
import { Role } from '../role'

/**
 * An Upgrader repairs structures in their room.
 *
 * @todo Refactor this.
 */
export class Repairer extends Role {
  /**
   * Creates an instance of Repairer.
   * @param {Creep} creep The current creep.
   *
   * @memberOf Repairer
   */
  constructor(creep: Creep) {
    super(creep)
  }

  /**
   * Run the module
   */
  public run(): void {
    if (_.sum(this.creep.carry) > 0) {
      const structuresToRepair = this.getStructuresToRepair(StructureManager.loadStructures(this.room))

      if (structuresToRepair) {
        if (this.creep.pos.isNearTo(structuresToRepair[0])) {
          this.creep.repair(structuresToRepair[0])
        } else {
          this.moveTo(structuresToRepair[0])
        }
      }
    } else {
      this.tryRetrieveEnergy()
    }
  }

  /**
   * Get an array of non-defensive structures that needs repair.
   *
   * Returns `undefined` if there are no structures to be repaired. This function
   * will never return walls or ramparts.
   *
   * @private
   * @param {Structure[]} structures The list of structures.
   * @returns {(Structure[] | undefined)} an array of structures to repair.
   *
   * @memberOf Repairer
   */
  private getStructuresToRepair(structures: Structure[]): Structure[] | undefined {
    let targets: Structure[]

    // Initial search scope.
    targets = structures.filter((structure: Structure) => {
      return ((structure.hits < (structure.hitsMax - (structure.hitsMax * 0.1))
        && (structure.structureType !== STRUCTURE_WALL && structure.structureType !== STRUCTURE_ROAD
          && structure.structureType !== STRUCTURE_RAMPART)))
    })

    // If nothing is found, expand searc to include roads.
    if (targets.length === 0) {
      targets = structures.filter((structure: Structure) => {
        return ((structure.hits < (structure.hitsMax - (structure.hitsMax * 0.1))
          && (structure.structureType !== STRUCTURE_WALL
            && structure.structureType !== STRUCTURE_RAMPART)))
      })
    }

    return targets
  }
}
