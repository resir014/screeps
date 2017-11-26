export class RoomExtension implements StonehengeRoomExtension {
  constructor(private context: RoomExtensionContext) {}

  private get memory(): RoomOrchestratorMemory {
    return this.context.memory
  }
}
