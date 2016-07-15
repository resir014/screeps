import { Config } from './../../config/config';

export namespace ResourceManager {

  export let resources: Resource[];
  export let resourceCount: number = 0;

  export function loadResources(room: Room) {
    resources = room.find<Resource>(FIND_DROPPED_RESOURCES);
    resourceCount = _.size(resources);

    if (Config.VERBOSE) {
      console.log('[ResourceManager]' + resourceCount + ' dropped resources found.');
    }
  }
}
