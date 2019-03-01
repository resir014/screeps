interface InitProcessMemory extends ProcessMemory {
  ran: boolean
}

export class InitProcess implements StonehengeProcess<InitProcessMemory> {
  constructor (private context: StonehengeProcessContext<InitProcessMemory>) {}

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
    this.log.info(`Current tick is ${Game.time}`)
    if (!this.memory.ran) {
      if (this.kernel) {
        this.log.info('Kernel is loaded.')
        this.kernel.startProcess<RoomOrchestratorMemory>('orchestrator/RoomOrchestrator', {
          rooms: {}
        })
      }
      this.memory.ran = true
    }
  }
}

export const bundle: StonehengeBundle<{}> = {
  install(registry: StonehengeProcessRegistry) {
    registry.register('init', InitProcess)
  }
}
