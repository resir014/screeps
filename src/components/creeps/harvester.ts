import { Config } from './../../config/config';
import { ICreepAction, CreepAction } from './creepAction';

export interface IHarvester {

  targetEnergyDropOff: Spawn | Structure;

  isBagNotEmpty(): boolean;
  tryHarvest(): number;
  moveToHarvest(): void;
  tryEnergyDropOff(): number;
  moveToDropEnergy(): void;

  action(): boolean;
}

export class Harvester extends CreepAction implements IHarvester, ICreepAction {

  public targetSource: Source;
  public targetEnergyDropOff: Spawn | Structure;

  public setCreep(creep: Creep) {
    super.setCreep(creep);

    this.targetEnergyDropOff = Game.getObjectById<Spawn | Structure>(this.creep.memory.target_energy_dropoff_id);
  }

  public isBagNotEmpty(): boolean {
    return (this.creep.carry.energy < this.creep.carryCapacity);
  }

  public tryEnergyDropOff(): number {
    return this.creep.transfer(this.targetEnergyDropOff, RESOURCE_ENERGY);
  }

  public moveToDropEnergy(): void {
    if (this.tryEnergyDropOff() == ERR_NOT_IN_RANGE) {
      this.moveTo(this.targetEnergyDropOff);
    }
  }

  public action(): boolean {
    if (this.isBagNotEmpty()) {
      this.moveToHarvest();
    } else {
      this.moveToDropEnergy();
    }

    return true
  }

}
