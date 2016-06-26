import { Config } from './../../config/config';
import { ICreepAction, CreepAction } from './creepAction';
import { ControllerManager } from './../controllers/controllerManager';
import { Harvester } from './harvester';

export interface IUpgrader {

  targetController: StructureController;

  tryUpgrade(): number;
  moveToUpgrade(): void;

  action(): boolean;

}

export class Upgrader extends Harvester implements IUpgrader, ICreepAction {

  public targetController: StructureController = null;

  public setCreep(creep: Creep) {
    super.setCreep(creep);

    this.targetController = ControllerManager.getController();
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
    // This is probably not the most efficient way to do this.
    if (this.isBagFull()) {
      this.moveToUpgrade();
    } else {
      this.moveToHarvest();
    }

    return true
  }
}
