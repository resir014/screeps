export namespace Config {

  /**
   * Enable this if you want a lot of text to be logged to console.
   *
   * @type {boolean}
   */
  export const VERBOSE: boolean = true;

  /**
   * @type {number}
   */
  export const MAX_HARVESTERS_PER_SOURCE: number = 2;

  /**
   * @type {number}
   */
  export const MAX_UPGRADERS_PER_CONTROLLER: number = 2;

  /**
   * @type {number}
   */
  export const MAX_BUILDERS_IN_ROOM: number = 4;

  /**
   * Default amount of minimal ticksToLive Screep can have, before it goes
   * to renew. This is only default value, that don't have to be used.
   * So it doesn't cover all Screeps.
   *
   * @type {number}
   */
  export const DEFAULT_MIN_LIFE_BEFORE_NEEDS_REFILL: number = 700;

}
