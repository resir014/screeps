/**
 * Gets the controller for this room.
 *
 * @export
 * @param {Room} room
 * @returns {(StructureController | undefined)} the room controller if
 *   available, otherwise undefined.
 */
export function getController(room: Room): StructureController | undefined {
  return room.controller;
}
