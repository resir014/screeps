import { RoomExtension } from 'bin/extensions/RoomExtension'
import { ExtensionRegistry } from 'os/ExtensionRegistry'

export class RoomOrchestratorProcess implements StonehengeProcess<RoomOrchestratorMemory> {
  public static imageName = 'orchestrator/RoomOrchestrator'

  constructor (private context: StonehengeProcessContext<RoomOrchestratorMemory>) {
    const registry = context.queryPosisInterface<ExtensionRegistry>('extensions/ExtensionRegistry') as ExtensionRegistry
    const registered = registry.register('orchestrator/RoomExtension', new RoomExtension({
      get memory() { return context.memory },
      get log() { return context.log }
    }))
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

  public run() {
    this.log.info(`RoomOrchestrator is running.`)
  }
}

export const bundle: StonehengeBundle<{}> = {
  install(registry: StonehengeProcessRegistry) {
    registry.register(RoomOrchestratorProcess.imageName, RoomOrchestratorProcess)
  }
}
