import { Config } from './../../config/config';
import { ICreepAction, CreepAction } from './creepAction';

export interface IRepairer {

  targetStructure: Structure;
  energyStation: Spawn | Structure;
  _minHitsBeforeNeedsRepair: number;

  hasEmptyBag(): boolean;
  askForEnergy(): number;
  moveToAskEnergy(): void;
  tryRepair(): number;
  moveToRepair(): void;

  action(): boolean;

}

export class Repairer extends CreepAction implements IRepairer, ICreepAction {

  public targetStructure: Structure = null;
  public energyStation: Spawn | Structure = null;

  public _minHitsBeforeNeedsRepair: number = Config.DEFAULT_MIN_HITS_BEFORE_NEEDS_REPAIR;

  public setCreep(creep: Creep) {
    super.setCreep(creep);

    this.targetStructure = <Structure>Game.getObjectById(this.creep.memory.target_repair_site_id);
    this.energyStation = <Spawn | Structure>Game.getObjectById(this.creep.memory.target_energy_station_id);
  }

  public hasEmptyBag(): boolean {
    return this.creep.carry.energy == 0;
  }

  public askForEnergy() {
    return this.energyStation.transferEnergy(this.creep);
  }

  public moveToAskEnergy(): void {
    if (this.askForEnergy() == ERR_NOT_IN_RANGE) {
      this.moveTo(this.energyStation);
    }
  }

  public tryRepair(): number {
    return this.creep.repair(this.targetStructure);
  }

  public moveToRepair(): void {
    if (this.tryRepair() == ERR_NOT_IN_RANGE) {
      this.moveTo(this.targetStructure);
    }
  }

  public action(): boolean {
    if (this.hasEmptyBag()) {
      this.moveToAskEnergy();
    } else {
      this.moveToRepair();
    }

    return true;
  }

}
