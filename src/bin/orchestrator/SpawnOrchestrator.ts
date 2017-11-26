interface SpawnOrchestratorProcessMemory extends ProcessMemory {
  [key: string]: any
}

export class SpawnOrchestratorProcess implements StonehengeProcess<SpawnOrchestratorProcessMemory> {
  public static imageName = 'orchestrator/SpawnOrchestrator'

  constructor (private context: StonehengeProcessContext<SpawnOrchestratorProcessMemory>) {}

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
    //
  }
}

export const bundle: StonehengeBundle<{}> = {
  install(registry: StonehengeProcessRegistry) {
    registry.register(SpawnOrchestratorProcess.imageName, SpawnOrchestratorProcess)
  }
}
