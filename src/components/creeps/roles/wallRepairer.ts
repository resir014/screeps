import { Config } from './../../../config/config';
import { ICreepAction, CreepAction } from './../creepAction';
import { FlagManager } from './../../flags/flagManager';

interface IWallRepairer {

  targetStructure: Structure;
  energyStation: Spawn | Structure;
  _minWallHealth: number;

  hasEmptyBag(): boolean;
  isBagFull(): boolean;
  askForEnergy(): number;
  moveToAskEnergy(): void;
  tryRepair(): number;
  moveToRepair(): void;

  action(): boolean;

}

export class WallRepairer extends CreepAction implements IWallRepairer, ICreepAction {

  public targetStructure: Structure;
  public energyStation: Spawn | Structure;

  public _minWallHealth: number = Config.MIN_WALL_HEALTH;

  public setCreep(creep: Creep) {
    super.setCreep(creep);

    this.targetStructure = Game.getObjectById<Structure>(this.creep.memory.target_repair_site_id);
    this.energyStation = Game.getObjectById<Spawn | Structure>(this.creep.memory.target_energy_station_id);
  }

  public askForEnergy() {
    if (this.energyStation instanceof Spawn || this.energyStation instanceof StructureExtension) {
      return (<Spawn | StructureExtension>this.energyStation).transferEnergy(this.creep);
    } else if (this.energyStation instanceof StructureContainer || this.energyStation instanceof StructureStorage) {
      return (<StructureContainer | StructureStorage>this.energyStation).transfer(this.creep, RESOURCE_ENERGY);
    }
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
    if ((this.creep.memory.repairing && this.hasEmptyBag()) || this.creep.memory.target_repair_site_id === null) {
      this.creep.memory.repairing = false;
    }
    if ((!this.creep.memory.repairing && this.isBagFull()) && this.creep.memory.target_repair_site_id !== null) {
      this.creep.memory.repairing = true;
    }

    if (this.creep.memory.repairing) {
      this.moveToRepair();
    } else {
      if (this.creep.memory.target_source_id) {
        if (!this.isBagFull()) {
          this.moveToHarvest();
        } else {
          this.moveTo(FlagManager.getFlag('RepairersPost'));
        }
      } else {
        if (!this.isBagFull()) {
          this.moveToAskEnergy();
        } else {
          this.moveTo(FlagManager.getFlag('RepairersPost'));
        }
      }
    }

    return true;
  }

}