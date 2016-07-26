import * as Config from "./../../config/config";
import * as RoomManager from "./../rooms/roomManager";

export let structures: Structure[];
export let structureCount: number = 0;

/**
 * Initialization scripts for the StructureManager module.
 *
 * @export
 * @param {Room} room
 */
export function load(room: Room) {
  structures = room.find<Structure>(FIND_STRUCTURES);
  structureCount = _.size(structures);

  if (Config.VERBOSE) {
    console.log("[StructureManager] " + structureCount + " structures in room.");
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
    return ((structure.structureType === STRUCTURE_CONTAINER)
      && _.sum(structure.store) < structure.storeCapacity);
  });

  // if we can't find any storage containers, use either the extension or spawn.
  if (targets.length === 0) {
    targets = structures.filter((structure: StructureExtension) => {
      return ((structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
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
      return ((structure.structureType === STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity);
    }
  });

  // If the spawn is full, we'll find any extensions/towers.
  if (targets.length === 0) {
    targets = structures.filter((structure) => {
      if (structure instanceof StructureExtension) {
        return ((structure.structureType === STRUCTURE_EXTENSION)
          && structure.energy < structure.energyCapacity);
      }
    });
  }

  // Or if that's filled as well, look for towers.
  if (targets.length === 0) {
    targets = structures.filter((structure: StructureTower) => {
      return ((structure.structureType === STRUCTURE_TOWER)
        && structure.energy < structure.energyCapacity - (structure.energyCapacity * 0.5));
    });
  }

  // Otherwise, look for storage containers.
  if (targets.length === 0) {
    targets = structures.filter((structure: StructureStorage) => {
      return ((structure.structureType === STRUCTURE_STORAGE) && _.sum(structure.store) < structure.storeCapacity);
    });
  }
  return targets[0];
}
