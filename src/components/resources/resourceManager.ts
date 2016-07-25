import { Config } from './../../config/config';

export namespace ResourceManager {

  export let resources: Resource[];
  export let resourceCount: number = 0;

  /**
   * Initialization scripts for the ResourceManager namespace.
   *
   * @export
   * @param {Room} room The current room.
   */
  export function loadResources(room: Room) {
    resources = room.find<Resource>(FIND_DROPPED_RESOURCES);
    resourceCount = _.size(resources);

    if (Config.VERBOSE) {
      console.log('[ResourceManager]' + resourceCount + ' dropped resources found.');
    }
  }
}
