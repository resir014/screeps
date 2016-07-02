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
    let targets: Structure[] = <Structure[]>RoomManager.getFirstRoom().find(FIND_STRUCTURES, {
      filter: (structure: StructureContainer | StructureStorage) => {
        return ((structure.structureType == STRUCTURE_CONTAINER)
          && _.sum(structure.store) < structure.storeCapacity);
      }
    });

    // if we can't find any storage containers, use either the extension or spawn.
    if (targets.length == 0) {
      targets = <Structure[]>RoomManager.getFirstRoom().find(FIND_STRUCTURES, {
        filter: (structure: StructureExtension) => {
          return ((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
            structure.energy < structure.energyCapacity);
        }
      });
    }

    return targets[0];
  }

  // TODO find() calls are much more expensive, let's try to find() once and
  // cache the result
  export function getDropOffPoint(): Structure {
    let targets: Structure[] = <Structure[]>RoomManager.getFirstRoom().find(FIND_STRUCTURES, {
      filter: (structure: Spawn) => {
        return ((structure.structureType == STRUCTURE_SPAWN)
          && structure.energy < structure.energyCapacity);
      }
    });

    // if we can't find any storage containers, use the extension.
    if (targets.length == 0) {
      targets = <Structure[]>RoomManager.getFirstRoom().find(FIND_STRUCTURES, {
        filter: (structure: StructureExtension) => {
          return ((structure.structureType == STRUCTURE_EXTENSION) &&
            structure.energy < structure.energyCapacity);
        }
      });
    }

    // Same thing, but we now look for storage.
    if (targets.length == 0) {
      targets = <Structure[]>RoomManager.getFirstRoom().find(FIND_STRUCTURES, {
        filter: (structure: StructureContainer | StructureStorage) => {
          return ((structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
            _.sum(structure.store) < structure.storeCapacity);
        }
      });
    }

    return targets[0];
  }

  export function getStructuresToRepair(): Structure {
    let targets: Structure[] = _.filter(this.structures, (structure: Structure) =>
      (structure.hits < structure.hitsMax));

    return targets[0];
  }

}
