import { Config } from './../../config/config';
import { RoomManager } from './../rooms/roomManager';

export namespace StructureManager {

  export let structures: Structure[];
  export let structureCount: number = 0;

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
    let targets: Structure[] = structures.filter((structure: StructureContainer) => {
      return ((structure.structureType == STRUCTURE_CONTAINER)
        && _.sum(structure.store) < structure.storeCapacity);
    });

    // if we can't find any storage containers, use either the extension or spawn.
    if (targets.length == 0) {
      targets = structures.filter((structure: StructureExtension) => {
        return ((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
          structure.energy < structure.energyCapacity);
      });
    }

    return targets[0];
  }

  // TODO find() calls are much more expensive, let's try to find() once and
  // cache the result
  export function getDropOffPoint(): Structure {
    let targets: Structure[] = structures.filter((structure) => {
      if (structure instanceof Spawn) {
        return ((structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity);
      }
    });

    // If the spawn is full, we'll find any extensions/towers.
    if (targets.length == 0) {
      targets = structures.filter((structure) => {
        if (structure instanceof StructureExtension) {
          return ((structure.structureType == STRUCTURE_EXTENSION)
            && structure.energy < structure.energyCapacity);
        }
      });
    }

    // Or if that's filled as well, look for towers.
    if (targets.length == 0) {
      targets = structures.filter((structure: StructureTower) => {
        return ((structure.structureType == STRUCTURE_TOWER)
          && structure.energy < structure.energyCapacity - (structure.energyCapacity * 0.5));
      });
    }

    // Otherwise, look for storage containers.
    if (targets.length == 0) {
      targets = structures.filter((structure: StructureStorage) => {
        return ((structure.structureType == STRUCTURE_STORAGE) && _.sum(structure.store) < structure.storeCapacity);
      });
    }
    return targets[0];
  }

  // TODO find() calls are much more expensive, let's try to find() once and
  // cache the result
  export function getStructuresToRepair(): Structure {
    let targets: Structure[] = structures.filter((structure: Structure) => {
      return ((structure.hits < (structure.hitsMax - (structure.hitsMax * 0.3))
        && (structure.structureType !== STRUCTURE_WALL && structure.structureType !== STRUCTURE_ROAD
        && structure.structureType !== STRUCTURE_RAMPART)));
    });

    if (targets.length == 0) {
      targets = structures.filter((structure: Structure) => {
        return ((structure.hits < (structure.hitsMax - (structure.hitsMax * 0.3))
          && (structure.structureType !== STRUCTURE_WALL && structure.structureType !== STRUCTURE_RAMPART)));
      })
    }

    if (targets.length == 0) {
      targets = structures.filter((structure: Structure) => {
        return ((structure.hits < (structure.hitsMax - (structure.hitsMax * 0.3))
          && (structure.structureType !== STRUCTURE_WALL)));
      })
    }

    return targets[0];
  }

  export function getDefensiveStructuresToRepair(): Structure {
    let targets: Structure[] = structures.filter((structure: Structure) => {
      return (structure.structureType === STRUCTURE_WALL && structure.hits < Config.MIN_WALL_HEALTH);
    });

    return targets[0];
  }

}
