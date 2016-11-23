import * as MemoryManager from "./../../../shared/memoryManager";
import { CreepAction } from "../creepAction";

/**
 * Harvests all available sources and drops it wherever they stand.
 *
 * @export
 * @class SourceMiner
 * @extends {CreepAction}
 */
export class SourceMiner extends CreepAction {
  private room: Room;

  /**
   * Creates an instance of SourceMiner.
   *
   * @param {Creep} creep The current creep.
   * @param {Room} room The current room.
   */
  constructor(creep: Creep, room: Room) {
    super(creep);
    this.room = room;
  }

  /**
   * Run all SourceMiner actions.
   */
  public run(): void {

    let availablePositions: RoomPosition[] = MemoryManager
      .memory.rooms[this.room.name].unoccupied_mining_positions;
    let assignedPosition: RoomPosition;

    if (availablePositions.length > 0 && !this.creep.memory.occupied_mining_position) {
      this.creep.memory.occupied_mining_position = availablePositions.pop();
      assignedPosition = new RoomPosition(
        this.creep.memory.occupied_mining_position.x,
        this.creep.memory.occupied_mining_position.y,
        this.creep.memory.occupied_mining_position.roomName
      );
      MemoryManager.memory.rooms[this.room.name].unoccupied_mining_positions = availablePositions;
    } else {
      assignedPosition = new RoomPosition(
        this.creep.memory.occupied_mining_position.x,
        this.creep.memory.occupied_mining_position.y,
        this.creep.memory.occupied_mining_position.roomName
      );
    }

    if (this.creep.pos.isEqualTo(assignedPosition)) {
      let targetSource = this.creep.pos.findClosestByPath<Source>(FIND_SOURCES);
      this.creep.harvest(targetSource);
    } else {
      this.moveTo(assignedPosition);
    }

  }

}
