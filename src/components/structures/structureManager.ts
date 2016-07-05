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
    let targets: Structure[] = _.filter(this.structures, (structure: StructureContainer | StructureStorage) => {
      return ((structure.structureType == STRUCTURE_CONTAINER)
        && _.sum(structure.store) < structure.storeCapacity);
    });

    // if we can't find any storage containers, use either the extension or spawn.
    if (targets.length == 0) {
      targets = _.filter(this.structures, (structure: StructureExtension) => {
        return ((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
          structure.energy < structure.energyCapacity);
      });
    }

    return targets[0];
  }

  export function getDropOffPoint(): Structure {
    let targets: Structure[] = _.filter(this.structures, (structure: Spawn) => {
      return ((structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity -
        (structure.energyCapacity * 0.1));
    });

    // If the spawn is full, we'll find any extensions/towers.
    if (targets.length === 0) {
      targets = _.filter(this.structures, (structure: StructureExtension | StructureTower) => {
        return ((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER)
          && structure.energy < structure.energyCapacity - (structure.energyCapacity * 0.1));
      });
    }

    // Otherwise, look for storage containers.
    if (targets.length === 0) {
      targets = _.filter(this.structures, (structure: StructureContainer) => {
        return ((structure.structureType == STRUCTURE_CONTAINER) && _.sum(structure.store) < structure.storeCapacity);
      });
    }

    return targets[0];
  }

  export function getStructuresToRepair(): Structure {
    let targets: Structure[] = _.filter(this.structures, (structure: Structure) => {
      return ((structure.hits < (structure.hitsMax - (structure.hitsMax * 0.1))
        && (structure.structureType !== STRUCTURE_WALL)));
    });

    return targets[0];
  }

  export function getWallsToRepair(): Structure {
    let targets: Structure[] = _.filter(this.structures, (structure: Structure) => {
      return (structure.structureType === STRUCTURE_WALL && structure.hits <= Config.MIN_WALL_HEALTH);
    });

    return targets[0];
  }

}
