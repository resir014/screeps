import * as StructureManager from '../../structures/structureManager'
import { Profile } from '../../../lib/profiler/profile'
import { Role } from '../role'

/**
 * A RampartMaintainer repairs ramparts in their room.
 *
 * @todo Refactor this.
 */
export class RampartMaintainer extends Role {
  /**
   * Creates an instance of RampartMaintainer.
   * @param {Creep} creep The current creep.
   *
   * @memberOf RampartMaintainer
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
   * @memberOf RampartMaintainer
   */
  @Profile()
  private getStructuresToRepair(structures: Structure[]): Structure[] | undefined {
    const targets: Structure[] = structures.filter((structure: Structure) => {
      return ((structure.structureType === STRUCTURE_RAMPART) && structure.hits < (structure.hits * 0.3))
    })

    return targets
  }
}
