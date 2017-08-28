// ------- objects ------- //

interface JobQueueTarget {
  room: string
  id?: string
}

interface RoomJobQueue {
  role: string
  target: JobQueueTarget
}

// ------- global declarations ------- //

// add objects to `global` here
declare namespace NodeJS {
  /**
   * Interface for the global objects.
   */
  interface Global {
    config: any
    Inscribe: ScreepsInscribe
    Orchestrator: IOrchestrator
  }
}

// ------- memory declarations ------- //

/**
 * Extended memory objects.
 */
interface Memory {
  guid: number
}

interface CreepMemory {
  role: string
  room: string
  assignedSource?: string
  state?: string
  action?: CreepAction
  [key: string]: any
}

interface RoomMemory {
  jobs: { [key: string]: number }
  queue: RoomJobQueue
  sources: string[]
  [key: string]: any
}

// ------- constants ------- //

declare const __BUILD_TIME__: string
declare const __REVISION__: string
