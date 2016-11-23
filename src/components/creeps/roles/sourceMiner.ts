import * as creepActions from "../creepActions";

/**
 * Runs all creep actions.
 *
 * @export
 * @param {Creep} creep The current creep.
 */
export function run(creep: Creep): void {
  let availablePositions: RoomPosition[] = Memory.rooms[creep.room.name]
    .unoccupied_mining_positions;
  let assignedPosition: RoomPosition;

  if (availablePositions.length > 0 && !creep.memory.occupied_mining_position) {
    creep.memory.occupied_mining_position = availablePositions.pop();
    assignedPosition = new RoomPosition(
      creep.memory.occupied_mining_position.x,
      creep.memory.occupied_mining_position.y,
      creep.memory.occupied_mining_position.roomName
    );
    Memory.rooms[creep.room.name].unoccupied_mining_positions = availablePositions;
  } else {
    assignedPosition = new RoomPosition(
      creep.memory.occupied_mining_position.x,
      creep.memory.occupied_mining_position.y,
      creep.memory.occupied_mining_position.roomName
    );
  }

  if (creep.pos.isEqualTo(assignedPosition)) {
    let targetSource = creep.pos.findClosestByPath<Source>(FIND_SOURCES);
    _tryHarvest(creep, targetSource);
  } else {
    creepActions.moveTo(creep, assignedPosition);
  }
}

/**
 * Attempt to harvest energy.
 *
 * @param {Creep} creep
 * @param {Source} target
 * @returns {number}
 */
function _tryHarvest(creep: Creep, target: Source): number {
  return creep.harvest(target);
}
