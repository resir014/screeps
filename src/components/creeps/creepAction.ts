import * as Config from "./../../config/config";

/**
 * Interface for the CreepAction class.
 *
 * @interface ICreepAction
 */
interface ICreepAction {
  creep: Creep;
  minLifeBeforeNeedsRenew: number;
  working: boolean;

  moveTo(target: RoomPosition | { pos: RoomPosition }): number;
  needsRenew(): boolean;
  tryRenew(spawn: Spawn): number;
  moveToRenew(spawn: Spawn): void;
}

/**
 * Shared actions for all Creeps.
 *
 * @export
 * @class CreepAction
 */
export class CreepAction {

  protected creep: Creep;
  protected minLifeBeforeNeedsRenew: number;
  private working: boolean;

  /**
   * Creates an instance of CreepAction.
   *
   * @param {Creep} creep
   */
  constructor(creep: Creep) {
    this.creep = creep;
    this.minLifeBeforeNeedsRenew = Config.DEFAULT_MIN_LIFE_BEFORE_NEEDS_REFILL;
    this.working = false;
  }

  /**
   * Shorthand method for `Creep.moveTo()`.
   *
   * @param {(RoomPosition | { pos: RoomPosition })} target
   * @returns {number}
   */
  public moveTo(target: RoomPosition | { pos: RoomPosition }): number {
    return this.creep.moveTo(target);
  }

  /**
   * Returns true if the `ticksToLive` of a creep has dropped below the renew
   * limit set in config.
   *
   * @returns {boolean}
   */
  public needsRenew(): boolean {
    return (this.creep.ticksToLive < this.minLifeBeforeNeedsRenew);
  }

  /**
   * Shorthand method for `renewCreep()`.
   *
   * @param {Spawn} spawn
   * @returns {number}
   */
  public tryRenew(spawn: Spawn): number {
    return spawn.renewCreep(this.creep);
  }

  /**
   * Moves a creep to a designated renew spot (in this case the spawn).
   *
   * @param {Spawn} spawn
   */
  public moveToRenew(spawn: Spawn): void {
    if (this.tryRenew(spawn) === ERR_NOT_IN_RANGE) {
      this.creep.moveTo(spawn);
    }
  }

}
