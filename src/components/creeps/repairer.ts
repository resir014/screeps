import { Config } from './../../config/config';
import { ICreepAction, CreepAction } from './creepAction';
import { ControllerManager } from './../controllers/controllerManager';
import { StructureManager } from './../structures/structureManager';
import { RoomManager } from './../rooms/roomManager';

export interface IRepairer {

  structures: Structure[];
  targetSource: Source;
  _minHitsBeforeNeedsRepair: number;

  isBagEmpty(): boolean;
  isBagFull(): boolean;
  findRepair(structures: Structure[]): Structure;
  tryRepair(targetStructure: Structure): number;
  tryHarvest(): number;
  moveToRepair(targetStructure: Structure): void;
  moveToHarvest(): void;

  action(): boolean;

}

export class Repairer extends CreepAction implements IRepairer, ICreepAction {

  public structures: Structure[] = [];
  public targetSource: Source = null;

  public _minHitsBeforeNeedsRepair: number = Config.DEFAULT_MIN_HITS_BEFORE_NEEDS_REPAIR;

  public setCreep(creep: Creep) {
    super.setCreep(creep);

    this.structures = StructureManager.structures;
    this.targetSource = <Source>Game.getObjectById(this.creep.memory.target_source_id);
  }

  public isBagEmpty(): boolean {
    return this.creep.carry.energy == 0;
  }

  public isBagFull(): boolean {
    return this.creep.carry.energy == this.creep.carryCapacity;
  }

  /**
   * Collects all available structure and determine which ones need repair.
   *
   * @param {Structure[]} structures
   * @returns {Structure} the first structure in the toRepair list.
   */
  public findRepair(structures: Structure[]): Structure {
    let toRepair: Structure[] = [];

    _.forEach(this.structures, function (structure: Structure) {
      if (structure.hits < Config.DEFAULT_MIN_HITS_BEFORE_NEEDS_REPAIR) {
        toRepair.push(structure);
      }
    });

    // For now, just return the first structure available.
    return toRepair[0];
  }

  public tryRepair(targetStructure: Structure): number {
    return this.creep.repair(targetStructure);
  }

  public tryHarvest(): number {
    return this.creep.harvest(this.targetSource);
  }

  public moveToRepair(targetStructure: Structure): void {
    if (this.tryRepair(targetStructure) == ERR_NOT_IN_RANGE) {
      this.moveTo(targetStructure);
    }
  }

  public moveToHarvest(): void {
    if (this.tryHarvest() == ERR_NOT_IN_RANGE) {
      this.moveTo(this.targetSource);
    }
  }

  public action(): boolean {
    let targetStructure = this.findRepair(this.structures);

    if (this.creep.memory.repairing && this.isBagEmpty()) {
      this.creep.memory.repairing = false;
    }
    if (!this.creep.memory.repairing && this.isBagFull()) {
      this.creep.memory.repairing = true;
    }

    if (this.creep.memory.repairing) {
      this.moveToRepair(targetStructure);
    } else {
      this.moveToHarvest();
    }

    return true;
  }

}
