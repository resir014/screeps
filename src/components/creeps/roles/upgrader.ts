import { Config } from './../../../config/config';
import { ICreepAction, CreepAction } from './../creepAction';

export interface IUpgrader {

  energyStation: Spawn | Structure;
  targetController: StructureController;

  hasEmptyBag(): boolean;
  isBagFull(): boolean;
  askForEnergy(): number;
  moveToAskEnergy(): void;
  tryUpgrade(): number;
  moveToUpgrade(): void;

  action(): boolean;

}

export class Upgrader extends CreepAction implements IUpgrader, ICreepAction {

  public targetController: StructureController;
  public energyStation: Spawn | Structure;

  public setCreep(creep: Creep) {
    super.setCreep(creep);

    this.targetController = Game.getObjectById<StructureController>(this.creep.memory.target_controller_id);
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

  public tryUpgrade(): number {
    return this.creep.upgradeController(this.targetController);
  }

  public moveToUpgrade(): void {
    if (this.tryUpgrade() == ERR_NOT_IN_RANGE) {
      this.moveTo(this.targetController);
    }
  }

  public action(): boolean {
    if (this.creep.memory.upgrading && this.hasEmptyBag()) {
      this.creep.memory.upgrading = false;
    }
    if (!this.creep.memory.upgrading && this.isBagFull()) {
      this.creep.memory.upgrading = true;
    }

    if (this.creep.memory.upgrading) {
      this.moveToUpgrade();
    } else {
      if (this.creep.memory.target_source_id) {
        this.moveToHarvest();
      } else {
        this.moveToAskEnergy();
      }
    }

    return true
  }
}