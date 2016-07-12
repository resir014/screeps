import { Config } from './../../config/config';
import { RoomManager } from './../rooms/roomManager';

export namespace ControllerManager {

  export let controller: Controller;

  export function loadController(room: Room): void {
    controller = room.controller;
  }

}
