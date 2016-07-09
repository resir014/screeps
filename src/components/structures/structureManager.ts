import { Config } from './../../config/config';
import { RoomManager } from './../rooms/roomManager';

export namespace StructureManager {

  export var structures: Structure[];
  export var structureCount: number = 0;

  export function loadStructures(room: Room) {
    structures = room.find<Structure>(FIND_STRUCTURES);
    structureCount = _.size(structures);

    if (Config.VERBOSE) {
      console.log('[StructureManager] ' + structureCount + ' structures in room.');
    }
  }

  export function getFirstStructure(): Structure {
    return structures[0];
  }

  // TODO find() calls are much more expensive, let's try to find() once and
  // cache the result
  export function getStorageObject(): Structure {
    let targets: Structure[] = _.filter(structures, (structure: StructureContainer) => {
      return ((structure.structureType == STRUCTURE_CONTAINER)
        && _.sum(structure.store) < structure.storeCapacity);
    });

    // if we can't find any storage containers, use either the extension or spawn.
    if (targets.length == 0) {
      targets = _.filter(structures, (structure: StructureExtension) => {
        return ((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
          structure.energy < structure.energyCapacity);
      });
    }

    return targets[0];
  }

  // TODO find() calls are much more expensive, let's try to find() once and
  // cache the result
  export function getDropOffPoint(): Structure {
    let targets: Structure[] = _.filter(structures, (structure: Spawn) => {
      return ((structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity -
        (structure.energyCapacity * 0.1));
    });

    // If the spawn is full, we'll find any extensions/towers.
    if (targets.length === 0) {
      targets = _.filter(structures, (structure: StructureExtension | StructureTower) => {
        return ((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER)
          && structure.energy < structure.energyCapacity - (structure.energyCapacity * 0.1));
      });
    }

    // Otherwise, look for storage containers.
    if (targets.length === 0) {
      targets = _.filter(structures, (structure: StructureContainer) => {
        return ((structure.structureType == STRUCTURE_CONTAINER) && _.sum(structure.store) < structure.storeCapacity);
      });
    }

    return targets[0];
  }

  // TODO find() calls are much more expensive, let's try to find() once and
  // cache the result
  export function getStructuresToRepair(): Structure {
    let targets: Structure[] = _.filter(structures, (structure: Structure) => {
      return ((structure.hits < (structure.hitsMax - (structure.hitsMax * 0.3))
        && (structure.structureType !== STRUCTURE_WALL && structure.structureType !== STRUCTURE_RAMPART)));
    });

    return targets[0];
  }

  export function getDefensiveStructuresToRepair(): Structure {
    let targets: Structure[] = _.filter(structures, (structure: Structure) => {
      return ((structure.hits < (structure.hitsMax - (structure.hitsMax * 0.5))
        && (structure.structureType === STRUCTURE_RAMPART)));
    });

    if (targets.length === 0) {
      targets = _.filter(this.structures, (structure: Structure) => {
        return (structure.structureType === STRUCTURE_WALL && structure.hits < Config.MIN_WALL_HEALTH);
      })
    }

    return targets[0];
  }

}
