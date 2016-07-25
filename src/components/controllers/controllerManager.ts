import * as Config from './../../config/config';
import * as RoomManager from './../rooms/roomManager';

export let controller: Controller;

/**
 * Initialization script for ControllerManager module.
 *
 * @export
 * @param {Room} room
 */
export function load(room: Room): void {
  controller = room.controller;
}
