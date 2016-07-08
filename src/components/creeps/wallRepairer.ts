import { Config } from './../../config/config';
import { ICreepAction, CreepAction } from './creepAction';
import { FlagManager } from '../flags/flagManager';

interface IWallRepairer {

  targetStructure: Structure;
  energyStation: Spawn | Structure;
  targetSource: Source;
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

  public targetStructure: Structure = null;
  public energyStation: Spawn | Structure = null;
  public targetSource: Source = null;

  public _minWallHealth: number = Config.MIN_WALL_HEALTH;

  public setCreep(creep: Creep) {
    super.setCreep(creep);

    this.targetStructure = <Structure>Game.getObjectById(this.creep.memory.target_repair_site_id);
    this.energyStation = <Spawn | Structure>Game.getObjectById(this.creep.memory.target_energy_station_id);
    this.targetSource = <Source>Game.getObjectById(this.creep.memory.target_source_id);
  }

  public hasEmptyBag(): boolean {
    return (this.creep.carry.energy == 0 || this.creep.carry.energy <= Config.MAX_ENERGY_REFILL_THRESHOLD);
  }

  public isBagFull(): boolean {
    return (this.creep.carry.energy == this.creep.carryCapacity);
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

  public tryHarvest(): number {
    return this.creep.harvest(this.targetSource);
  }

  public moveToHarvest(): void {
    if (this.tryHarvest() == ERR_NOT_IN_RANGE) {
      this.moveTo(this.targetSource);
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
    if ((this.creep.memory.repairing && this.hasEmptyBag()) || this.targetStructure === null) {
      this.creep.memory.repairing = false;
    }
    if (!this.creep.memory.repairing && this.isBagFull()) {
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
