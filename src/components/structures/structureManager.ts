import { Config } from './../../config/config';
import { RoomManager } from './../rooms/roomManager';

export namespace StructureManager {

  export let structures: Structure[];
  export let structureCount: number = 0;

  /**
   * Initialization scripts for the StructureManager namespace.
   *
   * @export
   * @param {Room} room
   */
  export function load(room: Room) {
    structures = room.find<Structure>(FIND_STRUCTURES);
    structureCount = _.size(structures);

    if (Config.VERBOSE) {
      console.log('[StructureManager] ' + structureCount + ' structures in room.');
    }
  }

  /**
   * Returns the first available structure.
   *
   * @export
   * @returns {Structure}
   */
  export function getFirstStructure(): Structure {
    return structures[0];
  }

  /**
   * Get the first storage object available. This prioritizes StructureContainer,
   * but will fall back to an extension, or to the spawn if need be.
   *
   * @export
   * @returns {Structure}
   */
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

  /**
   * Get the first energy dropoff point available. This prioritizes the spawn,
   * falling back on extensions, then towers, and finally containers.
   *
   * @export
   * @returns {Structure}
   */
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

  /**
   * Get the first available structure that needs repair.

   * This does *not* initially include defensive structures (walls, roads,
   * ramparts). If there are no such structures to be repaired, this expands to
   * include roads, then ramparts.
   *
   * Returns `undefined` if there are no structures to be repaired. This function
   * will never return a wall.
   *
   * @export
   * @returns {Structure}
   */
  export function getStructuresToRepair(): Structure {

    /* TODO - function name is getStructuresToRepair, but only returns a single
       Structure. Can we refactor this so that this returns Structure[]? - sL */

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

  /**
   * Get the first wall that needs repair.
   *
   * Returns `undefined` if there are no walls to be repaired.
   *
   * @export
   * @returns {Structure}
   */
  export function getDefensiveStructuresToRepair(): Structure {

    /* TODO - function name is getDefensiveStructuresToRepair, but only returns
       a single Structure. Can we refactor this so that this returns Structure[]?
       Also, this only returns walls. - sL */

    let targets: Structure[] = structures.filter((structure: Structure) => {
      return (structure.structureType === STRUCTURE_WALL && structure.hits < Config.MIN_WALL_HEALTH);
    });

    return targets[0];
  }

}
