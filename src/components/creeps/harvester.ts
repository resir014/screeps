import { Config } from './../../config/config';
import { ICreepAction, CreepAction } from './creepAction';
import { RoomManager } from './../rooms/roomManager';

export interface IHarvester {

  targetSource: Source;
  targetEnergyDropOff: Spawn | Structure;

  isBagNotEmpty(): boolean;
  tryHarvest(): number;
  moveToHarvest(): void;
  tryEnergyDropOff(): number;
  moveToDropEnergy(): void;

  action(): boolean;
}

export class Harvester extends CreepAction implements IHarvester, ICreepAction {

  public targetSource: Source = null;
  public targetEnergyDropOff: Spawn | Structure = null;

  public setCreep(creep: Creep) {
    super.setCreep(creep);

    this.setTargetDropOff();

    this.targetSource = <Source>Game.getObjectById(this.creep.memory.target_source_id);
    this.targetEnergyDropOff = <Spawn | Structure>Game.getObjectById(this.creep.memory.target_energy_dropoff_id);
  }

  public isBagNotEmpty(): boolean {
    return (this.creep.carry.energy < this.creep.carryCapacity);
  }

  public tryHarvest(): number {
    return this.creep.harvest(this.targetSource);
  }

  public moveToHarvest(): void {
    if (this.tryHarvest() == ERR_NOT_IN_RANGE) {
      this.moveTo(this.targetSource);
    }
  }

  public tryEnergyDropOff(): number {
    return this.creep.transfer(this.targetEnergyDropOff, RESOURCE_ENERGY);
  }

  public moveToDropEnergy(): void {
    if (this.tryEnergyDropOff() == ERR_NOT_IN_RANGE) {
      this.moveTo(this.targetEnergyDropOff);
    }
  }

  public setTargetDropOff(): void {
    let targets: Structure[] =  <Structure[]>RoomManager.getFirstRoom().find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
          structure.energy < structure.energyCapacity;
      }
    });

    this.creep.memory.target_energy_dropoff_id = targets[0];
  }

  public action(): boolean {
    if (this.needsRenew()) {
      this.moveToRenew();
    } else if (this.isBagNotEmpty()) {
      this.moveToHarvest();
    } else {
      this.moveToDropEnergy();
    }

    return true
  }

}
