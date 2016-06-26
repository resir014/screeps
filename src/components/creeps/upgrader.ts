import { Config } from './../../config/config';
import { ICreepAction, CreepAction } from './creepAction';

export interface IUpgrader {

  targetController: StructureController;

  tryUpgrade(): number;
}

export class Upgrader extends CreepAction implements IUpgrader, ICreepAction {

  public targetController: StructureController = null;

  public setCreep(creep: Creep) {
    super.setCreep(creep);

    this.targetController = <StructureController>Game.getObjectById(this.creep.memory.target_controller_id);
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
    this.moveToUpgrade();

    return true
  }
}
