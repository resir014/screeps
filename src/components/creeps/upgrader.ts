import { Config } from './../../config/config';
import { ICreepAction, CreepAction } from './creepAction';

export interface IUpgrader {

  energyStation: Spawn;
  targetController: StructureController;

  isBagEmpty(): boolean;
  isBagFull(): boolean;
  askForEnergy(): number;
  moveToAskEnergy(): void;
  tryUpgrade(): number;
  moveToUpgrade(): void;

  action(): boolean;

}

export class Upgrader extends CreepAction implements IUpgrader, ICreepAction {

  public targetController: StructureController = null;
  public energyStation: Spawn = null;

  public setCreep(creep: Creep) {
    super.setCreep(creep);

    this.targetController = <StructureController>Game.getObjectById(this.creep.memory.target_controller_id);
    this.energyStation = <Spawn>Game.getObjectById(this.creep.memory.target_energy_station_id);
  }

  public isBagEmpty(): boolean {
    return (this.creep.carry.energy == 0);
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

  public tryUpgrade(): number {
    return this.creep.upgradeController(this.targetController);
  }

  public moveToUpgrade(): void {
    if (this.tryUpgrade() == ERR_NOT_IN_RANGE) {
      this.moveTo(this.targetController);
    }
  }

  public action(): boolean {
    if (this.creep.memory.upgrading && this.isBagEmpty()) {
      this.creep.memory.upgrading = false;
    }
    if (!this.creep.memory.upgrading && this.isBagFull()) {
      this.creep.memory.upgrading = true;
    }

    if (this.creep.memory.upgrading) {
      this.moveToUpgrade();
    } else {
      this.moveToAskEnergy();
    }

    return true
  }
}
