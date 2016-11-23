export let controller: Controller | undefined;

/**
 * Initialization script for ControllerManager module.
 *
 * @export
 * @param {Room} room
 */
export function load(room: Room): void {
  controller = room.controller;
}
