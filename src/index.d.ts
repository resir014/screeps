// ------- objects ------- //

interface JobQueueTarget {
  /**
   * The room name of the creep's destination.
   *
   * @type {string}
   * @memberof JobQueueTarget
   */
  room: string
  /**
   * The object ID that the creep will interact with.
   *
   * @type {string}
   * @memberof JobQueueTarget
   */
  id?: string
}

interface CreepSpawnQueue {
  /**
   * The assigned creep role.
   *
   * @type {string}
   * @memberof CreepSpawnQueue
   */
  role: string
  /**
   * The creep priority. Lower number === higher priority.
   *
   * @type {number}
   * @memberof CreepSpawnQueue
   */
  priority: number
  /**
   * The metadata of the enqueued creep.
   *
   * @type {JobQueueTarget}
   * @memberof CreepSpawnQueue
   */
  target: JobQueueTarget
}

// ------- global declarations ------- //

// add objects to `global` here
declare namespace NodeJS {
  /**
   * Interface for the global objects.
   */
  interface Global {
    Config: any
    SpawnQueue: any
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
  target: JobQueueTarget
  state?: number
  [key: string]: any
}

interface RoomMemory {
  jobs: { [key: string]: number }
  queue: CreepSpawnQueue[]
  sources: string[]
  [key: string]: any
}

// ------- constants ------- //

declare const __BUILD_TIME__: string
declare const __REVISION__: string
