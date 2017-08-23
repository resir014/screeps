// BEGIN Extended prototypes

interface Creep {
  /**
   * Move around the map utilising utilising @bonzaiferroni's amazing Traveler library.
   *
   * @link https://github.com/bonzaiferroni/Traveler/wiki/Traveler-API
   * @param {(RoomPosition | { pos: RoomPosition })} destination The final creep destination.
   * @param {TravelToOptions} [options] Options used by the Traveler module.
   * @returns {number} A status code.
   * @memberof Creep
   */
  travelTo(destination: RoomPosition | { pos: RoomPosition }, options?: TravelToOptions): number
}

interface StructureSpawn {
  /**
   * Gets the largest buildable body parts from a certain set of available body parts.
   *
   * @param {string[][]} potentialBodies A list of potential body parts for the spawned creep.
   * @returns {string[]} the largest buildable body part.
   * @memberof StructureSpawn
   */
  getLargestBuildableBodyFromSet(potentialBodies: string[][]): string[]
  /**
   * Gets the largest buildable body parts for a certain body part template.
   *
   * @param {string[]} bodyTemplate The target body template.
   * @param {number} [maxIterations] Maximum iterations.
   * @returns {string[]} the largest buildable body part.
   * @memberof StructureSpawn
   */
  getLargestBuildableBodyFromTemplate(bodyTemplate: string[], maxIterations?: number): string[]
  /**
   * Gets the optimal amount of `MOVE` parts for a certain body part.
   *
   * @param {string[]} body The body parts to be calulated (without `MOVE` parts).
   * @param {('road' | 'plain' | 'swamp')} [terrain] The target terrain type for a creep.
   * @param {boolean} [fullCarry] set to `true` if the spawned creep is carrying the max amount of items.
   * @returns {number} the optimal count of `MOVE` parts.
   * @memberof StructureSpawn
   */
  findOptimalMoveCountForBody(body: string[], terrain?: 'road' | 'plain' | 'swamp', fullCarry?: boolean): number
}

// END Extended prototypes

// add objects to `global` here
declare namespace NodeJS {
  /**
   * Interface for the global objects.
   */
  interface Global {
    Orchestrator: any
    log: {
      level: number,
      showSource: boolean,
      showTick: boolean
    }
    // Profiler: Profiler
  }
}

/**
 * Extended memory objects.
 */
interface Memory {
  creeps: { [key: string]: any }
  flags: { [key: string]: any }
  rooms: { [key: string]: any }
  spawns: { [key: string]: any }
  guid: number
  log: any
  // Profiler: Profiler
}

declare const __REVISION__: string
