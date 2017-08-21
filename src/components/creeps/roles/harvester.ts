import { Profile } from '../../../lib/profiler/profile'
import { Role } from '../role'

/**
 * A Harvester occupies a mining position and harvests energy.
 */
export class Harvester extends Role {
  /**
   * Creates an instance of Harvester.
   * @param {Creep} creep The current creep.
   *
   * @memberOf Harvester
   */
  constructor(creep: Creep) {
    super(creep)
  }

  /**
   * Run the module.
   */
  @Profile()
  public run(): void {
    const availableSources: Source[] = Memory.rooms[this.creep.room.name].sources
    let assignedSource: Source | null

    if (availableSources.length > 0 && !this.creep.memory.assignedSource) {
      // We assign a creep to a source if we don't have any assigned to it.
      this.creep.memory.assignedSource = availableSources.pop()

      assignedSource = Game.getObjectById<Source>(this.creep.memory.assignedSource)
      Memory.rooms[this.creep.room.name].sources = availableSources
    } else {
      // Use the existing assigned source.
      assignedSource = Game.getObjectById<Source>(this.creep.memory.assignedSource)
    }

    if (assignedSource) {
      if (this.creep.pos.isNearTo(assignedSource)) {
        this.tryHarvest(assignedSource)
      } else {
        this.moveTo<Source>(assignedSource, 1)
      }
    }
  }

  /**
   * Attempt to harvest energy.
   *
   * @private
   * @param {Source} target The target energy source to harvest.
   * @returns {number} A status code.
   *
   * @memberOf Harvester
   */
  @Profile()
  private tryHarvest(target: Source): number {
    return this.creep.harvest(target)
  }
}
