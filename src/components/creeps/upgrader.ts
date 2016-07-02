import { Config } from './../../config/config';
import { ICreepAction, CreepAction } from './creepAction';

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

  public targetController: StructureController = null;
  public energyStation: Spawn | Structure = null;

  public setCreep(creep: Creep) {
    super.setCreep(creep);

    this.targetController = <StructureController>Game.getObjectById(this.creep.memory.target_controller_id);
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

    if (this.hasEmptyBag()) {
      this.moveToAskEnergy();
    } else {
      this.moveToUpgrade();
    }

    return true
  }
}
