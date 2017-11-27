import { RoomExtension } from 'bin/extensions/RoomExtension'
import { ExtensionRegistry } from 'os/ExtensionRegistry'

export class RoomOrchestratorProcess implements StonehengeProcess<RoomOrchestratorMemory> {
  public static imageName = 'orchestrator/RoomOrchestrator'

  constructor (private context: StonehengeProcessContext<RoomOrchestratorMemory>) {
    const registry = context.queryPosisInterface<ExtensionRegistry>('extensions/ExtensionRegistry') as ExtensionRegistry
    const registered = registry.register(RoomExtension.imageName, new RoomExtension({
      get memory() { return context.memory },
      get log() { return context.log }
    }))
    if (!registered) throw new Error(`Could not register ${RoomExtension.imageName}`)
  }

  private get log() {
    return this.context.log
  }
  public get memory() {
    return this.context.memory
  }
  private get kernel() {
    return this.context.queryPosisInterface('BaseKernel') as StonehengeKernel
  }
  private get roomExtension() {
    return this.context.queryPosisInterface(RoomExtension.imageName) as RoomExtension
  }

  public run() {
    this.log.info(`RoomOrchestrator is running.`)
    this.roomExtension.manageRooms()
  }
}

export const bundle: StonehengeBundle<{}> = {
  install(registry: StonehengeProcessRegistry) {
    registry.register(RoomOrchestratorProcess.imageName, RoomOrchestratorProcess)
  }
}
