import * as Config from "../../config/config";

/**
 * Shorthand method for `Creep.moveTo()`.
 *
 * @export
 * @param {Creep} creep
 * @param {(Structure | RoomPosition)} target
 * @returns {number}
 */
export function moveTo(creep: Creep, target: Structure | ConstructionSite | RoomPosition): number {
  let result: number = 0;

  // Execute moves by cached paths at first
  result = creep.moveTo(target);

  return result;
}

/**
 * Shorthand method for `Creep.moveTo()`, adjusted for Resource.
 *
 * @export
 * @param {Creep} creep
 * @param {(Structure | RoomPosition)} target
 * @returns {number}
 */
export function moveToResource(creep: Creep, target: Resource | RoomPosition): number {
  let result: number = 0;

  // Execute moves by cached paths at first
  result = creep.moveTo(target);

  return result;
}

/**
 * Returns true if the `ticksToLive` of a creep has dropped below the renew
 * limit set in config.
 *
 * @export
 * @param {Creep} creep
 * @returns {boolean}
 */
export function needsRenew(creep: Creep): boolean {
  return (creep.ticksToLive < Config.DEFAULT_MIN_LIFE_BEFORE_NEEDS_REFILL);
}

/**
 * Shorthand method for `renewCreep()`.
 *
 * @export
 * @param {Creep} creep
 * @param {Spawn} spawn
 * @returns {number}
 */
export function tryRenew(creep: Creep, spawn: Spawn): number {
  return spawn.renewCreep(creep);
}

/**
 * Moves a creep to a designated renew spot (in this case the spawn).
 *
 * @export
 * @param {Creep} creep
 * @param {Spawn} spawn
 */
export function moveToRenew(creep: Creep, spawn: Spawn): void {
  if (tryRenew(creep, spawn) === ERR_NOT_IN_RANGE) {
    creep.moveTo(spawn);
  }
}

export function tryRetrieveEnergy(creep: Creep): void {
  let targetSource = creep.pos.findClosestByPath<Resource>(FIND_DROPPED_RESOURCES);

  if (targetSource) {
    if (creep.pos.isNearTo(targetSource)) {
      creep.pickup(targetSource);
    } else {
      moveToResource(creep, targetSource);
    }
  } else {
    let targetContainer = creep.pos.findClosestByPath<Container>(FIND_STRUCTURES, {
      filter: ((structure: Structure) => {
        if (structure.structureType === STRUCTURE_CONTAINER) {
          let container = <Container> structure;
          if (_.sum(container.store) > (500)) {
            return container;
          }
        }
      })
    });

    if (targetContainer) {
      if (creep.pos.isNearTo(targetContainer)) {
        creep.withdraw(targetContainer, RESOURCE_ENERGY);
      } else {
        moveTo(creep, targetContainer);
      }
    }
  }
}

/**
 * Attempts transferring available resources to the creep.
 *
 * @export
 * @param {Creep} creep
 * @param {RoomObject} roomObject
 */
export function getEnergy(creep: Creep, roomObject: RoomObject): void {
  let energy: Resource = <Resource> roomObject;

  if (energy) {
    if (creep.pos.isNearTo(energy)) {
      creep.pickup(energy);
    } else {
      moveTo(creep, energy.pos);
    }
  }
}

/**
 * Returns true if a creep's `working` memory entry is set to true, and false
 * otherwise.
 *
 * @export
 * @param {Creep} creep
 * @returns {boolean}
 */
export function canWork(creep: Creep): boolean {
  let working = creep.memory.working;

  if (working && _.sum(creep.carry) === 0) {
    creep.memory.working = false;
    return false;
  } else if (!working && _.sum(creep.carry) === creep.carryCapacity) {
    creep.memory.working = true;
    return true;
  } else {
    return creep.memory.working;
  }
}
