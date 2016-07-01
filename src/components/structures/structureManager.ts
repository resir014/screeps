import { Config } from './../../config/config';
import { RoomManager } from './../rooms/roomManager';

export namespace StructureManager {

  export var structures: Structure[];
  export var structureCount: number = 0;

  export function loadStructures() {
    this.structures = RoomManager.getFirstRoom().find(FIND_STRUCTURES);
    this.structureCount = _.size(this.structures);

    if (Config.VERBOSE) {
      console.log('[StructureManager] ' + this.structureCount + ' structures in room.');
    }
  }

  export function getFirstStructure(): Structure {
    return this.structures[0];
  }

  // TODO find() calls are much more expensive, let's try to find() once and
  // cache the result
  export function getStorageObject(): Structure {
    let targets: Structure[] = _.filter(this.structures, (structure: Structure) => {
      if (structure instanceof StructureExtension) {
        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_STORAGE) &&
        structure.energy < structure.energyCapacity;
      } else if (structure instanceof StructureContainer || structure instanceof Storage) {
        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_STORAGE) &&
        structure.store < structure.storeCapacity;
      }
    });

    return targets[0];
  }

  export function getStructuresToRepair(): Structure {
    let targets: Structure[] = _.filter(this.structures, (structure: Structure) =>
      (structure.hits < Config.DEFAULT_MIN_HITS_BEFORE_NEEDS_REPAIR));

    return targets[0];
  }

}
