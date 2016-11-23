import { log } from "../utils/log";

export let sourceMiningJobs: number = 0;

export const haulerJobs: number = 3; // not used yet.
export const upgraderJobs: number = 5;
export const builderJobs: number = 1;
export const repairerJobs: number = 3;
export const wallRepairerJobs: number = 2;

/**
 * Initialization scripts for the JobManager module.
 *
 * @export
 */
export function load() {
  sourceMiningJobs = 2;

  log.info("[JobManager] Successfully loaded");
}
