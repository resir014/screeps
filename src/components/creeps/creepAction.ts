import { Config } from './../../config/config';

export interface ICreepAction {
  creep: Creep;
  renewStation: Spawn;
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

  public _minLifeBeforeNeedsRenew: number = Config.DEFAULT_MIN_LIFE_BEFORE_NEEDS_REFILL;

  public setCreep(creep: Creep) {
    this.creep = creep;
    this.renewStation = Game.getObjectById<Spawn>(this.creep.memory.renew_station_id);
  }

  /**
   * Wrapper for Creep.moveTo() method.
   *
   * @param {(RoomPosition | {pos: RoomPosition})} target
   * @returns
   */
  public moveTo(target: RoomPosition | {pos: RoomPosition}) {
    return this.creep.moveTo(target);
  }

  public hasEmptyBag(): boolean {
    return (this.creep.carry.energy == 0 || this.creep.carry.energy <= Config.MAX_ENERGY_REFILL_THRESHOLD);
  }

  public isBagFull(): boolean {
    return (this.creep.carry.energy == this.creep.carryCapacity);
  }

  public needsRenew(): boolean {
    return (this.creep.ticksToLive < this._minLifeBeforeNeedsRenew);
  }

  public tryRenew(): number {
    return this.renewStation.renewCreep(this.creep);
  }

  public moveToRenew(): void {
    if (this.tryRenew() == ERR_NOT_IN_RANGE) {
      this.moveTo(this.renewStation);
    }
  }

  public action(): boolean {
    return true;
  }
}
