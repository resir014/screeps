import { ProcessRegistry } from './ProcessRegistry'
import { ExtensionRegistry } from './ExtensionRegistry'
import { Logger } from '../lib/Logger'
import { ErrorMapper } from '../lib/ErrorMapper'

export class BaseKernel implements StonehengeKernel {
  private currentId: number = 0
  private processCache: StonehengeProcessCache = {}
  private logger = new Logger('[Kernel]')

  constructor(private processRegistry: ProcessRegistry, private extensionRegistry: ExtensionRegistry) {}

  public get memory(): KernelMemory {
    Memory.kernel = Memory.kernel || { processTable: {}, processMemoryTable: {} }
    return Memory.kernel
  }

  public get processTable(): StonehengeProcessTable {
    this.memory.processTable = this.memory.processTable || {}
    return this.memory.processTable
  }

  public get processMemoryTable(): ProcessMemoryTable {
    this.memory.processMemoryTable = this.memory.processMemoryTable || {}
    return this.memory.processMemoryTable
  }

  public start(): void {
    // TODO
  }

  public run(): void {
    const pids = Object.keys(this.processTable)
    if (pids.length === 0) {
      const proc = this.startProcess('init', {})
      if (proc) pids.push(proc.pid.toString())
    }

    let runCount = 0
    for (const i of pids) {
      const cid = parseInt(i, 10)
      const pinfo = this.processTable[cid]

      if (pinfo.status !== ProcessStatus.RUNNING && pinfo.ended && pinfo.ended < Game.time - 100) {
        delete this.processTable[cid]
      }

      if (pinfo.wake && pinfo.wake > Game.time) continue
      if (pinfo.status !== ProcessStatus.RUNNING) continue

      runCount += 1
      try {
        const proc = this.getProcessById(cid)
        if (!proc) throw new Error(`Could not get process ${cid} ${pinfo.imageName}`)
        this.currentId = cid
        proc.run()
        this.currentId = 0
      } catch (e) {
        this.killProcess(cid)
        pinfo.status = ProcessStatus.DEAD
        pinfo.error = ErrorMapper.sourceMappedStackTrace(e.stack || e.toString())
        this.logger.error(() => `[${cid}] ${pinfo.imageName} crashed\n${e.stack}`)
      }
    }

    if (runCount === 0) this.startProcess('init', {})
  }

  public shutdown(): void {
    // Clear non-existing creep memory.
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory[name]
      }
    }
  }

  public startProcess<T extends ProcessMemory>(imageName: string, startContext: T): ProcessStart<T> | undefined {
    const id: number = this.getFreePid()

    const pinfo: ProcessInfo = {
      id,
      imageName,
      pid: this.currentId,
      status: ProcessStatus.RUNNING,
      started: Game.time
    }

    this.processTable[id] = pinfo
    this.processMemoryTable[id] = startContext

    const proc = this.createProcess(id, imageName, startContext)
    if (!proc) return undefined

    this.logger.debug(() => `startProcess ${imageName}`)
    return { pid: id, process: proc }
  }

  public getProcessById<T extends ProcessMemory>(pid: number): StonehengeProcess<T> | undefined {
    if (!this.processTable[pid] || this.processTable[pid].status === ProcessStatus.DEAD) {
      return undefined
    }

    let proc = this.processCache[pid] as StonehengeProcess<T>
    if (!proc) {
      proc = this.createProcess(pid, this.processTable[pid].imageName, this.processMemoryTable[pid] as T)
    }
    return proc
  }

  private getFreePid(): number {
    Memory.pidCounter = Memory.pidCounter || 0
    while (this.getProcessById(Memory.pidCounter)) {
      Memory.pidCounter += 1
    }
    return Memory.pidCounter
  }

  public killProcess(pid: number) {
    const pinfo = this.processTable[pid]
    if (!pinfo || !pinfo.pid) return

    this.logger.warn(() => `Killed process ${pid}: ${pinfo.imageName}`)
    pinfo.status = ProcessStatus.DEAD
    pinfo.stopped = Game.time

    for (const i in this.processTable) {
      const cid = parseInt(i, 10)
      const cinfo = this.processTable[cid]

      if (cinfo.pid === pinfo.id && cinfo.status !== ProcessStatus.DEAD) {
        this.killProcess(cid)
      }
    }
  }

  public setParent(id: number, parentId?: number): boolean {
    if (!this.processTable[id]) return false
    if (parentId) {
      this.processTable[id].pid = parentId
      return true
    }
    return false
  }

  private shouldContinueLoop(): boolean {
    let tickLimit = Game.cpu.tickLimit

    if (Game.cpu.bucket < 10000) tickLimit = Game.cpu.limit - 10

    return Game.cpu.getUsed() < tickLimit
  }

  private createProcess<T extends ProcessMemory>(id: number, imageName: string, startContext: T): StonehengeProcess<T> {
    // tslint:disable-next-line:no-var-self
    const self = this
    this.logger.debug(() => `createProcess ${id}`)
    const pinfo = this.processTable[id]
    if (!pinfo || pinfo.status !== ProcessStatus.RUNNING) {
      throw new Error(`Process ${pinfo.id} ${pinfo.imageName} not running.`)
    }

    const context: StonehengeProcessContext<T> = {
      id: pinfo.id,
      get pid() {
        return self.processTable[id] && self.processTable[id].pid || 0
      },
      imageName: pinfo.imageName,
      log: new Logger(`[${pinfo.id}: ${pinfo.imageName}]`),
      get memory() {
        self.processMemoryTable[pinfo.id] = self.processMemoryTable[pinfo.id] || {}
        return self.processMemoryTable[pinfo.id] as T
      },
      queryPosisInterface: self.extensionRegistry.getExtension.bind(self.extensionRegistry)
    }
    Object.freeze(context)

    const process = this.processRegistry.getNewProcess(pinfo.imageName, context)
    if (!process) throw new Error(`Could not create process ${pinfo.id} ${pinfo.imageName}`)

    this.processCache[id] = process
    return process
  }
}
