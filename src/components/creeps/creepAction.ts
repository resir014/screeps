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
  tryRetrieveEnergy(): void;
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
   * @param {Creep} creep The current creep.
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

  /**
   * Retrieves energy from any dropped resources or containers.
   *
   * Creeps will attempt to retrieve any dropped energy within the room, if
   * nothing is found, then they will look for any containers which hold more
   * than 500 units of energy.
   */
  public tryRetrieveEnergy(): void {
    let targetSource = this.creep.pos.findClosestByPath<Resource>(FIND_DROPPED_RESOURCES);

    if (targetSource) {
      if (this.creep.pos.isNearTo(targetSource)) {
        this.creep.pickup(targetSource);
      } else {
        this.moveTo(targetSource);
      }
    } else {
      let targetContainer = this.creep.pos.findClosestByPath<Container>(FIND_STRUCTURES, {
        filter: ((structure: Structure) => {
          if (structure.structureType === STRUCTURE_CONTAINER) {
            let container = <Container>structure;
            if (_.sum(container.store) > (500)) {
              return container;
            }
          }
        })
      });

      if (targetContainer) {
        if (this.creep.pos.isNearTo(targetContainer)) {
          this.creep.withdraw(targetContainer, RESOURCE_ENERGY);
        } else {
          this.moveTo(targetContainer);
        }
      }
    }
  }

}
