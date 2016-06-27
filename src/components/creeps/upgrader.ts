import { Config } from './../../config/config';
import { ICreepAction, CreepAction } from './creepAction';
import { ControllerManager } from './../controllers/controllerManager';
import { Harvester } from './harvester';

export interface IUpgrader {

  targetSource: Source;
  targetController: StructureController;

  isBagEmpty(): boolean;
  isBagFull(): boolean;
  tryUpgrade(): number;
  moveToUpgrade(): void;
  tryHarvest(): number;
  moveToHarvest(): void;

  action(): boolean;

}

export class Upgrader extends CreepAction implements IUpgrader, ICreepAction {

  public targetSource: Source = null;
  public targetController: StructureController = null;

  public setCreep(creep: Creep) {
    super.setCreep(creep);

    this.targetSource = <Source>Game.getObjectById(this.creep.memory.target_source_id);
    this.targetController = ControllerManager.getController();
  }

  public isBagEmpty(): boolean {
    return (this.creep.carry.energy == 0);
  }

  public isBagFull(): boolean {
    return this.creep.carry.energy == this.creep.carryCapacity;
  }

  public tryUpgrade(): number {
    return this.creep.upgradeController(this.targetController);
  }

  public moveToUpgrade(): void {
    if (this.tryUpgrade() == ERR_NOT_IN_RANGE) {
      this.moveTo(this.targetController);
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

  public action(): boolean {
    if (this.creep.memory.upgrading && this.isBagEmpty()) {
      this.creep.memory.upgrading = false;
    }
    if (!this.creep.memory.upgrading && this.isBagFull()) {
      this.creep.memory.upgrading = true;
    }

    if (this.needsRenew()) {
      this.moveToRenew();
    } else if (this.creep.memory.upgrading) {
      this.moveToUpgrade();
    } else {
      this.moveToHarvest();
    }

    return true
  }
}
