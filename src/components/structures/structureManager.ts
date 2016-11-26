import * as Config from "../../config/config";
import { log } from "../../utils/log";

/**
 * Loads all the available structures within a room.
 *
 * @export
 * @param {Room} room The current room.
 * @returns {Structure[]} an array of structures inside the room
 */
export function loadStructures(room: Room): Structure[] {
  return room.find<Structure>(FIND_STRUCTURES);
}

/**
 * Gets the number of structures available in the room.
 *
 * @export
 * @param {Room} room
 * @returns {number} the number of structures available in the room
 */
export function getStructureCount(room: Room): number {
  let structureCount: number = _.size(room.find<Structure>(FIND_STRUCTURES));

  if (Config.ENABLE_DEBUG_MODE) {
    log.debug("[StructureManager]", structureCount + " structures in room.");
  }

  return structureCount;
}

/**
 * Get the first storage object available. This prioritizes StructureContainer,
 * but will fall back to an extension, or to the spawn if need be.
 *
 * @export
 * @param {Structure[]} structures The list of structures to filter.
 * @returns {Structure} the desired structure.
 */
export function getStorageObject(structures: Structure[]): Structure {
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
 * @param {Structure[]} structures The list of structures to filter.
 * @returns {Structure} the desired structure.
 */
export function getDropOffPoint(structures: Structure[]): Structure {
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
