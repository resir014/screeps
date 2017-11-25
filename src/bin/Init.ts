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

  public run() {
    this.log.info(`Current tick is ${Game.time}`)
  }
}

export const bundle: StonehengeBundle<{}> = {
  install(registry: StonehengeProcessRegistry) {
    registry.register('init', InitProcess)
  }
}
