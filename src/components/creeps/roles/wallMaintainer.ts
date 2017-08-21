import * as StructureManager from '../../structures/structureManager'
import { Profile } from '../../../lib/profiler/profile'
import { Role } from '../role'

/**
 * An WallMaintainer repairs walls in their room.
 *
 * @todo Refactor this.
 */
export class WallMaintainer extends Role {
  /**
   * Creates an instance of WallMaintainer.
   * @param {Creep} creep The current creep.
   *
   * @memberOf WallMaintainer
   */
  constructor(creep: Creep) {
    super(creep)
  }

  /**
   * Run the module
   */
  @Profile()
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
   * Get an array of roads that needs repair.
   *
   * Returns `undefined` if there are no roads to be repaired.
   *
   * @private
   * @param {Structure[]} structures The list of structures.
   * @returns {(Structure[] | undefined)} an array of roads to repair.
   *
   * @memberOf WallMaintainer
   */
  @Profile()
  private getStructuresToRepair(structures: Structure[]): Structure[] | undefined {
    const targets: Structure[] = structures.filter((structure: Structure) => {
      return ((structure.structureType === STRUCTURE_WALL) && structure.hits < 700000)
    })

    return targets
  }
}
