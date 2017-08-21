import * as StructureManager from '../structures/structureManager'

/**
 * Shared role for all Creeps.
 */
export class Role {
  protected memory: Memory
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
    this.state = this.memory.state
  }

  /**
   * Extended method of `Creep.moveTo()`.
   *
   * @template T A RoomObject type.
   * @param {T} target The target room object.
   * @param {number} [maxRooms] The maximum allowed rooms to search. The default (and
   *   maximum) is 16. This is only used when the new `PathFinder` is enabled.
   * @returns {number}
   *
   * @memberOf Role
   */
  public moveTo<T extends RoomObject>(target: T, maxRooms?: number): number {
    const self = this
    let result: number = 0

    // Execute moves by cached paths at first
    result = self.creep.moveTo(target, { noPathFinding: true })

    // Perform pathfinding only if we have enough CPU
    if (result !== 0) {
      if (Game.cpu.tickLimit - Game.cpu.getUsed() > 20) {
        result = self.creep.moveTo(target, { maxRooms: maxRooms || 1 })
      }
    }
    return result
  }

  /**
   * Extended method of `Creep.moveTo()`, adjusted for RoomPosition.
   *
   * @param {RoomPosition} target The target room position.
   * @param {number} [maxRooms] The maximum allowed rooms to search. The default (and
   *   maximum) is 16. This is only used when the new `PathFinder` is enabled.
   * @returns {number} A status code.
   *
   * @memberOf Role
   */
  public moveToPosition(target: RoomPosition, maxRooms?: number): number {
    const self = this
    let result: number = 0

    // Execute moves by cached paths at first
    result = self.creep.moveTo(target, { noPathFinding: true })

    // Perform pathfinding only if we have enough CPU
    if (result !== 0) {
      if (Game.cpu.tickLimit - Game.cpu.getUsed() > 20) {
        result = self.creep.moveTo(target, { maxRooms: maxRooms || 1 })
      }
    }
    return result
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
   */
  public moveToRenew(spawn: Spawn): void {
    if (this.tryRenew(spawn) === ERR_NOT_IN_RANGE) {
      this.creep.moveTo(spawn)
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
