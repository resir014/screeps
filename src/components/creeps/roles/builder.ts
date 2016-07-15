import { Config } from './../../../config/config';
import { ICreepAction, CreepAction } from './../creepAction';
import { FlagManager } from './../../flags/flagManager';

export interface IBuilder {

  targetConstructionSite: ConstructionSite;
  energyStation: Spawn | Structure;

  hasEmptyBag(): boolean;
  isBagFull(): boolean;
  askForEnergy(): number;
  moveToAskEnergy(): void;
  tryBuild(): number;
  moveToBuild(): void;

  action(): boolean;

}

export class Builder extends CreepAction implements IBuilder, ICreepAction {

  public targetConstructionSite: ConstructionSite;
  public energyStation: Spawn | Structure;

  public setCreep(creep: Creep) {
    super.setCreep(creep);

    this.targetConstructionSite = Game.getObjectById<ConstructionSite>(this.creep.memory.target_construction_site_id);
    this.energyStation = Game.getObjectById<Spawn | Structure>(this.creep.memory.target_energy_station_id);
  }

  public askForEnergy(): number {
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

  public tryBuild(): number {
    return this.creep.build(this.targetConstructionSite);
  }

  public moveToBuild(): void {
    if (this.tryBuild() == ERR_NOT_IN_RANGE) {
      this.moveTo(this.targetConstructionSite);
    }
  }

  public action(): boolean {
    if ((this.creep.memory.building && this.hasEmptyBag()) || this.creep.memory.target_construction_site_id === null) {
      this.creep.memory.building = false;
    }
    if ((!this.creep.memory.building && this.isBagFull()) && this.creep.memory.target_construction_site_id !== null) {
      this.creep.memory.building = true;
    }

    if (this.creep.memory.building) {
      this.moveToBuild();
    } else {
      if (this.creep.memory.target_source_id) {
        if (!this.isBagFull()) {
          this.moveToHarvest();
        } else {
          this.moveTo(FlagManager.getFlag('BuildersPost'));
        }
      } else {
        if (!this.isBagFull()) {
          this.moveToAskEnergy();
        } else {
          this.moveTo(FlagManager.getFlag('BuildersPost'));
        }
      }
    }

    return true;
  }

}
