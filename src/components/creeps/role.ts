import * as StructureManager from '../structures/structureManager'
import { Traveler } from '../../lib/Traveler/Traveler'

/**
 * Shared role for all Creeps.
 */
export class Role {
  protected memory: CreepMemory
  protected creep: Creep
  protected room: Room
  protected state: string

  /**
   * Creates an instance of Role.
   * @param {Creep} creep The creep.
   *
   * @memberOf Role
   */
  constructor(creep: Creep) {
    this.creep = creep
    this.room = this.creep.room
    this.memory = creep.memory
    this.state = this.memory.state || 'idle'
  }

  /**
   * Extended method of `Creep.moveTo()`, utilising @bonzaiferroni's amazing
   * Traveler library.
   *
   * @link https://github.com/bonzaiferroni/Traveler/wiki/Traveler-API
   * @template T A RoomObject type.
   * @param {T} target The target room object.
   * @param {TravelToOptions} [options] Options used by the Traveler module.
   * @returns {number}
   *
   * @memberOf Role
   */
  public moveTo<T extends RoomObject>(target: T, options?: TravelToOptions): number {
    return this.creep.travelTo(target, options)
  }

  /**
   * Extended method of `Creep.moveTo()`, utilising @bonzaiferroni's amazing
   * Traveler library.
   *
   * @link https://github.com/bonzaiferroni/Traveler/wiki/Traveler-API
   * @param {RoomPosition} target The target room position.
   * @param {TravelToOptions} [options] Options used by the Traveler module.
   * @returns {number} A status code.
   *
   * @memberOf Role
   */
  public moveToPosition(target: RoomPosition, options?: TravelToOptions): number {
    return this.creep.travelTo(target, options)
  }

  /**
   * Shorthand method for `renewCreep()`.
   *
   * @param {Spawn} spawn The current room's spawn.
   * @returns {number} A status code.
   *
   * @memberOf Role
   */
  public tryRenew(spawn: Spawn): number {
    return spawn.renewCreep(this.creep)
  }

  /**
   * Moves a creep to a designated renew spot (in this case the spawn).
   *
   * @param {Spawn} spawn The current room's spawn.
   * @param {TravelToOptions} [options] Options used by the Traveler module.
   *    See {@link https://github.com/bonzaiferroni/Traveler/wiki/Traveler-API}
   */
  public moveToRenew(spawn: Spawn, options?: TravelToOptions): void {
    if (this.tryRenew(spawn) === ERR_NOT_IN_RANGE) {
      Traveler.travelTo(this.creep, spawn, options)
    }
  }

  /**
   * Attempts retrieving any dropped resources and/or resources in a container.
   */
  public tryRetrieveEnergy(): void {
    // Locate a container, for starter.
    const targets: Structure[] | undefined = StructureManager.getSourceWithdrawalPoints(this.room)

    if (targets) {
      const thisTarget = targets[0]

      if (thisTarget instanceof Structure) {
        if (this.creep.pos.isNearTo(thisTarget)) {
          this.creep.withdraw(thisTarget, RESOURCE_ENERGY)
        } else {
          this.moveTo(thisTarget)
        }
      }
    } else {
      // Locate a dropped resource in case we can't find any containers.
      const targetSource = this.creep.pos.findClosestByPath<Resource>(FIND_DROPPED_RESOURCES)
      if (this.creep.pos.isNearTo(targetSource)) {
        this.creep.pickup(targetSource)
      } else {
        this.moveTo(targetSource)
      }
    }
  }
}
