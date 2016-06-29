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

  export function getStorageObject(): Structure {
    let targets: Structure[] = <Structure[]>RoomManager.getFirstRoom().find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
          structure.energy < structure.energyCapacity;
      }
    });

    return targets[0];
  }

  export function getStructuresToRepair(): Structure {
    let targets: Structure[] = _.filter(this.structures, (structure: Structure) => {
      return (structure.hits < Config.DEFAULT_MIN_HITS_BEFORE_NEEDS_REPAIR);
    });

    return targets[0];
  }

}
