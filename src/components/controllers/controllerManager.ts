import { Config } from './../../config/config';
import { RoomManager } from './../rooms/roomManager';

export namespace ControllerManager {

  export let controller: Controller;

  /**
   * Initialization script for ControllerManager namespace.
   *
   * @export
   * @param {Room} room
   */
  export function load(room: Room): void {
    controller = room.controller;
  }

}
