export class RoomExtension implements StonehengeRoomExtension {
  public static imageName = 'orchestrator/RoomExtension'

  constructor(private context: RoomExtensionContext) {}

  private get log() {
    return this.context.log
  }
  private get memory(): RoomOrchestratorMemory {
    return this.context.memory
  }

  public manageRooms() {
    _.each(Game.rooms, (room: Room) => {
      this.log.info(`Room ${room.name} is available`)
    })
  }
}
