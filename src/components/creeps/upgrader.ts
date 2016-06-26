import { Config } from './../../config/config';
import { ICreepAction, CreepAction } from './creepAction';
import { Harvester } from './harvester';

export interface IUpgrader {

  targetController: StructureController;

  tryUpgrade(): number;
}

export class Upgrader extends Harvester implements IUpgrader, ICreepAction {

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
    // This is probably not the most efficient way to do this.
    if (this.creep.carry.energy == 0) {
      this.moveToHarvest();
    } else {
      this.moveToUpgrade();
    }

    return true
  }
}
