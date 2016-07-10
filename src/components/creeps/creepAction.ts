import { Config } from './../../config/config';

export interface ICreepAction {
  creep: Creep;
  renewStation: Spawn;
  targetSource: Source;
  _minLifeBeforeNeedsRenew: number;

  setCreep(creep: Creep): void;

  /**
   * Wrapper for Creep.moveTo() method.
   */
  moveTo(target: RoomPosition | {pos: RoomPosition}): number;

  hasEmptyBag(): boolean;
  isBagFull(): boolean;
  needsRenew(): boolean;
  tryRenew(): number;
  moveToRenew(): void;

  action(): boolean;
}

export class CreepAction implements ICreepAction {
  public creep: Creep = null;
  public renewStation: Spawn = null;
  public targetSource: Source;

  public _minLifeBeforeNeedsRenew: number = Config.DEFAULT_MIN_LIFE_BEFORE_NEEDS_REFILL;

  /**
   * Sets the current active creep.
   *
   * @param {Creep} creep
   */
  public setCreep(creep: Creep) {
    this.creep = creep;
    this.renewStation = Game.getObjectById<Spawn>(this.creep.memory.renew_station_id);
    this.targetSource = Game.getObjectById<Source>(this.creep.memory.target_source_id);
  }

  /**
   * Wrapper for Creep.moveTo() method.
   *
   * @param {(RoomPosition | {pos: RoomPosition})} target
   * @returns {number}
   */
  public moveTo(target: RoomPosition | {pos: RoomPosition}): number {
    return this.creep.moveTo(target);
  }

  /**
   * Checks if the creep is not carrying anything.
   *
   * @returns {boolean}
   */
  public hasEmptyBag(): boolean {
    return (this.creep.carry.energy == 0 || this.creep.carry.energy <= Config.MAX_ENERGY_REFILL_THRESHOLD);
  }

  /**
   * Checks if the creep reaches its maximum carrying capacity.
   *
   * @returns {boolean}
   */
  public isBagFull(): boolean {
    return (this.creep.carry.energy == this.creep.carryCapacity);
  }

  /**
   * Checks if a creep's life is low enough for a renew.
   *
   * @returns {boolean}
   */
  public needsRenew(): boolean {
    return (this.creep.ticksToLive < this._minLifeBeforeNeedsRenew);
  }

  /**
   * Attempts renewing a creep on the designated renew station.
   *
   * @returns {number}
   */
  public tryRenew(): number {
    return this.renewStation.renewCreep(this.creep);
  }

  /**
   * Moves a creep to the designated renew station.
   */
  public moveToRenew(): void {
    if (this.tryRenew() == ERR_NOT_IN_RANGE) {
      this.moveTo(this.renewStation);
    }
  }

  /**
   * Attempts harvesting for a resource.
   *
   * @returns {number}
   */
  public tryHarvest(): number {
    return this.creep.harvest(this.targetSource);
  }

  /**
   * Moves a creep to the designated harvestable source.
   */
  public moveToHarvest(): void {
    if (this.tryHarvest() == ERR_NOT_IN_RANGE) {
      this.moveTo(this.targetSource);
    }
  }

  public action(): boolean {
    return true;
  }
}
