import { Config } from './../../config/config';
import { ICreepAction, CreepAction } from './creepAction';

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

  public targetConstructionSite: ConstructionSite = null;
  public energyStation: Spawn | Structure = null;

  public setCreep(creep: Creep) {
    super.setCreep(creep);

    this.targetConstructionSite = <ConstructionSite>Game.getObjectById(this.creep.memory.target_construction_site_id);
    this.energyStation = <Spawn | Structure>Game.getObjectById(this.creep.memory.target_energy_station_id);
  }

  public hasEmptyBag(): boolean {
    return (this.creep.carry.energy == 0 || this.creep.carry.energy <= Config.MAX_ENERGY_REFILL_THRESHOLD);
  }

  public isBagFull(): boolean {
    return (this.creep.carry.energy == this.creep.carryCapacity);
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
    if (this.creep.memory.building && this.hasEmptyBag()) {
      this.creep.memory.building = false;
    }
    if (!this.creep.memory.building && this.isBagFull()) {
      this.creep.memory.building = true;
    }

    if (this.hasEmptyBag()) {
      this.moveToAskEnergy();
    } else {
      this.moveToBuild();
    }

    return true;
  }

}
