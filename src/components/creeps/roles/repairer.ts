import * as StructureManager from '../../structures/structureManager'
import { Profile } from '../../../lib/profiler/profile'
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
   * Get an array of structures that needs repair.
   *
   * Note that this does *not* initially defensive structures (walls, roads,
   * ramparts). If there are no such structures to be repaired, this expands to
   * include roads, then ramparts.
   *
   * Returns `undefined` if there are no structures to be repaired. This function
   * will never return a wall.
   *
   * @private
   * @param {Structure[]} structures The list of structures.
   * @returns {(Structure[] | undefined)} an array of structures to repair.
   *
   * @memberOf Repairer
   */
  @Profile()
  private getStructuresToRepair(structures: Structure[]): Structure[] | undefined {

    let targets: Structure[]

    // Initial search scope.
    targets = structures.filter((structure: Structure) => {
      return ((structure.hits < (structure.hitsMax - (structure.hitsMax * 0.1))
        && (structure.structureType !== STRUCTURE_WALL && structure.structureType !== STRUCTURE_ROAD
          && structure.structureType !== STRUCTURE_RAMPART)))
    })

    // If nothing is found, expand search to include roads.
    if (targets.length === 0) {
      targets = structures.filter((structure: Structure) => {
        return ((structure.hits < (structure.hitsMax - (structure.hitsMax * 0.1))
          && (structure.structureType !== STRUCTURE_WALL && structure.structureType !== STRUCTURE_RAMPART)))
      })
    }

    // If we still find nothing, expand search to ramparts.
    if (targets.length === 0) {
      targets = structures.filter((structure: Structure) => {
        return ((structure.hits < (structure.hitsMax - (structure.hitsMax * 0.1))
          && (structure.structureType !== STRUCTURE_WALL)))
      })
    }

    return targets
  }
}
