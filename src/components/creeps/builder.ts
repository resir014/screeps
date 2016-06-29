import { Config } from './../../config/config';
import { ICreepAction, CreepAction } from './creepAction';

export interface IBuilder {

  targetConstructionSite: ConstructionSite;
  energyStation: Spawn;

  isBagEmpty(): boolean;
  isBagFull(): boolean;
  askForEnergy(): number;
  moveToAskEnergy(): void;
  tryBuild(): number;
  moveToBuild(): void;

  action(): boolean;

}

export class Builder extends CreepAction implements IBuilder, ICreepAction {

  public targetConstructionSite: ConstructionSite = null;
  public energyStation: Spawn = null;

  public setCreep(creep: Creep) {
    super.setCreep(creep);

    this.targetConstructionSite = <ConstructionSite>Game.getObjectById(this.creep.memory.target_construction_site_id);
    this.energyStation = <Spawn>Game.getObjectById(this.creep.memory.target_energy_station_id);
  }

  public isBagEmpty(): boolean {
    return this.creep.carry.energy == 0;
  }

  public isBagFull(): boolean {
    return this.creep.carry.energy == this.creep.carryCapacity;
  }

  public askForEnergy(): number {
    return this.energyStation.transferEnergy(this.creep);
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
    if (this.creep.memory.building && this.isBagEmpty()) {
      this.creep.memory.building = false;
    }
    if (!this.creep.memory.building && this.isBagFull()) {
      this.creep.memory.building = true;
    }

    if (this.creep.memory.building) {
      this.moveToBuild();
    } else {
      this.moveToAskEnergy();
    }

    return true;
  }

}
