export class RoomExtension implements StonehengeRoomExtension {
  public static imageName = 'orchestrator/RoomExtension'

  constructor(private context: RoomExtensionContext) {}

  private get log() {
    return this.context.log
  }
  private get memory(): RoomOrchestratorMemory {
    return this.context.memory
  }
  private get rooms(): { [key: string]: RoomMemory } {
    return this.memory.rooms
  }

  public manageRooms() {
    for (const spawn in Game.spawns) {
      const room = Game.spawns[spawn].room
      this.log.info(`Room ${room.name} is available`)

      if (!this.rooms[room.name]) {
        //
      }
    }
  }
}
