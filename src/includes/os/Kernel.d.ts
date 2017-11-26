// Kernel architecture mainly inspired from:
// https://github.com/screepers/POSIS

declare const enum ProcessStatus {
  RUNNING = 'running',
  DEAD = 'dead',
  SLEEP = 'sleep'
}

declare interface ProcessMemory {
  [key: string]: any
}

declare interface ProcessInfo {
  id: number
  pid: number
  imageName: string
  status: ProcessStatus
  started: number
  stopped?: number
  wake?: number
  ended?: number
  error?: string
}

declare interface ProcessStart<T extends ProcessMemory> {
  pid: number
  process: StonehengeProcess<T>
}

declare interface StonehengeProcessCache {
  [id: number]: StonehengeProcess<ProcessMemory>
}

declare interface StonehengeProcessTable {
  [id: number]: ProcessInfo
}

declare interface ProcessMemoryTable {
  [id: number]: ProcessMemory
}

declare interface KernelMemory {
  processTable: StonehengeProcessTable
  processMemoryTable: ProcessMemoryTable
}

declare interface StonehengeKernel {
  start(): void
  run(): void
  shutdown(): void

  startProcess<T extends ProcessMemory>(imageName: string, startContext: T): ProcessStart<T> | undefined
  killProcess(pid: number): void
  getProcessById<T extends ProcessMemory>(pid: number): StonehengeProcess<T> | undefined
  setParent(pid: number, parentId?: number): boolean
}

declare interface StonehengeProcessContext<T extends ProcessMemory> {
  readonly id: number
  readonly pid: number
  readonly imageName: string
  readonly memory: T
  readonly log: StonehengeLogger
}

declare interface StonehengeProcessConstructor<T extends ProcessMemory> {
  new (context: StonehengeProcessContext<T>): StonehengeProcess<T>
}

declare interface StonehengeProcessRegistry {
  register<T extends ProcessMemory>(imageName: string, constructor: StonehengeProcessConstructor<T>): boolean
}

declare interface StonehengeProcess<T extends ProcessMemory> {
  readonly memory: T
  run(): void
}
