import { Config } from './../../config/config';
import { RoomManager } from './../rooms/roomManager';

export namespace ControllerManager {

  export var controller: StructureController;

  export function getController(): StructureController {
    this.controller = RoomManager.getFirstRoom().controller;

    return this.controller;
  }

}
