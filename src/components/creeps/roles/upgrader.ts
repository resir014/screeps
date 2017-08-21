import { Profile } from '../../../lib/profiler/profile'
import { Role } from '../role'

/**
 * An Upgrader upgrades the controller in their room.
 *
 * @todo Refactor this.
 */
export class Upgrader extends Role {
  /**
   * Creates an instance of Upgrader.
   * @param {Creep} creep The current creep.
   *
   * @memberOf Upgrader
   */
  constructor(creep: Creep) {
    super(creep)
  }

  /**
   * Run the module.
   */
  @Profile()
  public run(): void {
    const roomController: StructureController | undefined = this.creep.room.controller

    if (!this.memory.state) {
      this.memory.state = 'idle'
    }

    if (_.sum(this.creep.carry) === 0) {
      this.memory.state = 'idle'
    }

    if (_.sum(this.creep.carry) < this.creep.carryCapacity && this.memory.state !== 'upgrading') {
      const targetSource = this.creep.pos.findClosestByPath<Resource>(FIND_DROPPED_RESOURCES)

      if (targetSource) {
        if (this.creep.pos.isNearTo(targetSource)) {
          this.creep.pickup(targetSource)
        } else {
          this.moveTo(targetSource, 1)
        }
      } else {
        this.tryRetrieveEnergy()
      }
    } else {
      this.memory.state = 'upgrading'

      if (roomController && this.creep.upgradeController(roomController) === ERR_NOT_IN_RANGE) {
        this.moveTo(roomController)
      }
    }
  }
}
