import { MemoryManager } from './../../../shared/memoryManager';

export namespace SourceMiner {
  let availablePositions: RoomPosition[];
  let assignedPosition: RoomPosition;
  let targetSource: Source

  export function run(creep: Creep, room: Room): void {

    availablePositions = MemoryManager.memory[room.name]['unoccupied_mining_positions'];

    if (availablePositions.length > 0 && creep.memory['occupied_mining_position'] === null) {
      creep.memory['occupied_mining_position'] = availablePositions.pop();
      assignedPosition = new RoomPosition(
        creep.memory['occupied_mining_position'].x,
        creep.memory['occupied_mining_position'].y,
        creep.memory['occupied_mining_position'].roomName
      );
      MemoryManager.memory[room.name]['unoccupied_mining_positions'] = availablePositions;
    } else {
      assignedPosition = new RoomPosition(
        creep.memory['occupied_mining_position'].x,
        creep.memory['occupied_mining_position'].y,
        creep.memory['occupied_mining_position'].roomName
      );
    }

    if (creep.pos.isEqualTo(assignedPosition)) {
      targetSource = creep.pos.findClosestByPath<Source>(FIND_SOURCES);
      creep.harvest(targetSource);
    } else {
      creep.moveTo(assignedPosition);
    }

  }
}
