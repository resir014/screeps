import { Config } from './../../config/config';
import { RoomManager } from './../rooms/roomManager';

export namespace ControllerManager {

  export function getController(): StructureController {
    return RoomManager.getFirstRoom().controller;
  }

}
