declare interface StonehengeRoomExtension extends StonehengeExtension {
  //
}

declare interface RoomOrchestratorMemory extends ProcessMemory {
  rooms: {
    [roomName: string]: any
  }
}

declare interface RoomMemory {
  isRegistered: boolean
}

declare interface RoomExtensionContext {
  readonly memory: RoomOrchestratorMemory
  readonly log: StonehengeLogger
}
