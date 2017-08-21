import { ENABLE_DEBUG_MODE } from '../../config/config'
import { log } from '../../lib/logger'

/**
 * Loads all the available structures within a room.
 *
 * @export
 * @param {Room} room The current room.
 * @returns {Structure[]} an array of structures inside the room
 */
export function loadStructures(room: Room): Structure[] {
  return room.find<Structure>(FIND_STRUCTURES)
}

/**
 * Get the storage objects available. This prioritizes StructureContainer,
 * but will fall back to an extension, or to the spawn if need be.
 *
 * @export
 * @param {Room} room The current room.
 * @returns {Structure[]} an array of storage objects
 */
export function getStorageObjects(room: Room): Structure[] {
  const structures: Structure[] = loadStructures(room)

  if (ENABLE_DEBUG_MODE) {
    log.debug(`${room.name}: ${_.size(structures)} structures found.`)
  }

  let targets: Structure[] = structures.filter((structure: StructureContainer) => {
    return ((structure.structureType === STRUCTURE_CONTAINER)
      && _.sum(structure.store) < structure.storeCapacity)
  })

  // if we can't find any storage containers, use either the extension or spawn.
  if (targets.length === 0) {
    targets = structures.filter((structure: StructureExtension) => {
      return ((structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
        structure.energy < structure.energyCapacity)
    })
  }

  return targets
}

/**
 * Get the storage objects available. This prioritizes StructureContainer,
 * but will fall back to an extension, or to the spawn if need be.
 *
 * @export
 * @param {Room} room The current room.
 * @returns {(Structure[] | undefined)} an array of source withdrawal points if any, else undefined.
 */
export function getSourceWithdrawalPoints(room: Room): Structure[] | undefined {
  const structures: Structure[] = loadStructures(room)
  let targets: Structure[] = []

  if (ENABLE_DEBUG_MODE) {
    log.debug(`${room.name}: ${_.size(structures)} structures found.`)
  }

  // First pass: prioritise StructureStorage.
  targets = structures.filter((structure: Structure) => {
    if (structure.structureType === STRUCTURE_STORAGE) {
      const storage = structure as Storage
      if (_.sum(storage.store) > 500) {
        return storage
      }
    }
  })

  // Second pass: if no StructureStorage is found, find any containers.
  if (targets.length === 0) {
    targets = structures.filter((structure: Structure) => {
      if (structure.structureType === STRUCTURE_CONTAINER) {
        const storage = structure as Container
        if (_.sum(storage.store) > 500) {
          return storage
        }
      }
    })
  }

  return targets || undefined
}

/**
 * Get the energy dropoff points available. This prioritizes the spawn,
 * falling back on extensions, then towers, and finally containers.
 *
 * @export
 * @param {Room} room The current room
 * @returns {Structure[]} An array of energy dropoff points, if any.
 */
export function getDropOffPoints(room: Room): Structure[] {
  const structures: Structure[] = loadStructures(room)

  if (ENABLE_DEBUG_MODE) {
    log.debug(`${room.name}: ${_.size(structures)} structures found.`)
  }

  let targets: Structure[] = structures.filter((structure: Structure) => {
    if (structure instanceof Spawn) {
      return ((structure.structureType === STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity)
    }
  })

  // If the spawn is full, we'll find any extensions/towers.
  if (targets.length === 0) {
    targets = structures.filter((structure: Structure) => {
      if (structure instanceof StructureExtension) {
        return ((structure.structureType === STRUCTURE_EXTENSION)
          && structure.energy < structure.energyCapacity)
      }
    })
  }

  // Or if that's filled as well, look for towers.
  if (targets.length === 0) {
    targets = structures.filter((structure: StructureTower) => {
      return ((structure.structureType === STRUCTURE_TOWER)
        && structure.energy < structure.energyCapacity - (structure.energyCapacity * 0.5))
    })
  }

  // Otherwise, look for storage containers.
  if (targets.length === 0) {
    targets = structures.filter((structure: StructureStorage) => {
      return ((structure.structureType === STRUCTURE_STORAGE) && _.sum(structure.store) < structure.storeCapacity)
    })
  }

  return targets
}
