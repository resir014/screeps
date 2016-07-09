export namespace Config {

  /**
   * Enable this if you want a lot of text to be logged to console.
   *
   * @type {boolean}
   */
  export const VERBOSE: boolean = true;

  /**
   * Specify whether to use the new experimental pathfinder in game objects
   * methods.
   *
   * @type {boolean}
   */
  export const USE_PATHFINDER: boolean = true;

  /**
   * @type {number}
   */
  export const MAX_HARVESTERS_PER_SOURCE: number = 5;

  /**
   * @type {number}
   */
  export const MAX_UPGRADERS_PER_CONTROLLER: number = 5;

  /**
   * @type {number}
   */
  export const MAX_BUILDERS_IN_ROOM: number = 4;

  /**
   * @type {number}
   */
  export const MAX_REPAIRERS_IN_ROOM: number = 4;

  /**
   * @type {number}
   */
  export const MAX_WALL_REPAIRERS_IN_ROOM: number = 4;

  /**
   * @type {number}
   */
  export const MAX_ENERGY_REFILL_THRESHOLD: number = 10;

  /**
   * @type {number}
   */
  export const MIN_WALL_HEALTH: number = 200000;

  /**
   * @type {number}
   */
  export const MIN_RAMPART_HEALTH: number = 150000;

  /**
   * Default amount of minimal ticksToLive Screep can have, before it goes
   * to renew. This is only default value, that don't have to be used.
   * So it doesn't cover all Screeps.
   *
   * @type {number}
   */
  export const DEFAULT_MIN_LIFE_BEFORE_NEEDS_REFILL: number = 400;

  /**
   * Default amount of minimal hit points a Structure can have before it needs
   * to be repaired.
   *
   * @type {number}
   */
  export const DEFAULT_MIN_HITS_BEFORE_NEEDS_REPAIR: number = 600;

}
