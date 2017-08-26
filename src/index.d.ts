// ------- global declarations ------- //

// add objects to `global` here
declare namespace NodeJS {
  /**
   * Interface for the global objects.
   */
  interface Global {
    config: any
    Inscribe: InscribeGlobal
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
  sources: string[]
  [key: string]: any
}

// ------- constants ------- //

declare const __REVISION__: string | undefined
