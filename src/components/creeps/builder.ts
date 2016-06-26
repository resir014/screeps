import { Config } from './../../config/config';
import { ICreepAction, CreepAction } from './creepAction';
import { ControllerManager } from './../controllers/controllerManager';
import { ConstructionSiteManager } from './../constructionSites/constructionSiteManager';
import { RoomManager } from './../rooms/roomManager';

export interface IBuilder {

  targetSite: ConstructionSite;
  targetSource: Source;

  isBagEmpty(): boolean;
  isBagFull(): boolean;
  tryBuild(): number;
  moveToBuild(): void;

  action(): boolean;

}

export class Builder extends CreepAction implements IBuilder, ICreepAction {

  public targetSite: ConstructionSite = null;
  public targetSource: Source = null;

  public setCreep(creep: Creep) {
    super.setCreep(creep);

    this.targetSite = ConstructionSiteManager.getFirstConstructionSite();
    this.targetSource = <Source>Game.getObjectById(this.creep.memory.target_source_id);
  }

  public isBagEmpty(): boolean {
    return this.creep.carry.energy == 0;
  }

  public isBagFull(): boolean {
    return this.creep.carry.energy == this.creep.carryCapacity;
  }

  public tryBuild(): number {
    return this.creep.build(this.targetSite);
  }

  public tryHarvest(): number {
    return this.creep.harvest(this.targetSource);
  }

  public moveToBuild(): void {
    if (this.tryBuild() == ERR_NOT_IN_RANGE) {
      this.moveTo(this.targetSite);
    }
  }

  public moveToHarvest(): void {
    if (this.tryHarvest() == ERR_NOT_IN_RANGE) {
      this.moveTo(this.targetSource);
    }
  }

  public action(): boolean {
    if (this.creep.memory.building && this.isBagEmpty()) {
      this.creep.memory.building = false;
    }
    if (!this.creep.memory.building && this.isBagFull()) {
      this.creep.memory.building = true;
    }

    if (this.needsRenew()) {
      this.moveToRenew();
    } else if (this.creep.memory.building) {
      this.moveToBuild();
    } else {
      this.moveToHarvest();
    }

    return true;
  }

}
