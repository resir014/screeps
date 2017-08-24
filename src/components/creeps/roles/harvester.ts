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
  public run(): void {
    const availableSources: Source[] = (Memory.rooms[this.creep.room.name] as RoomMemory).sources
    const creepMemory: CreepMemory = this.creep.memory

    if (availableSources.length > 0 && !creepMemory.assignedSource) {
      // We assign a creep to a source if we don't have any assigned to it.
      creepMemory.assignedSource = availableSources.pop()

      Memory.rooms[this.creep.room.name].sources = availableSources
    } else {
      // Use the existing assigned source.
    }

    if (creepMemory.assignedSource) {
      if (this.creep.pos.isNearTo(creepMemory.assignedSource)) {
        this.tryHarvest(creepMemory.assignedSource)
      } else {
        this.moveTo<Source>(creepMemory.assignedSource)
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
  private tryHarvest(target: Source): number {
    return this.creep.harvest(target)
  }
}
