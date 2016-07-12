import { Config } from './../../config/config';
import { RoomManager } from './../rooms/roomManager';

export namespace SourceManager {

  export let sources: Source[];
  export let sourceCount: number;

  /**
   * Initialization scripts for the SourceManager namespace.
   *
   * @export
   * @param {Room} room
   */
  export function load(room: Room) {
    sources = room.find<Source>(FIND_SOURCES_ACTIVE);
    sourceCount = _.size(sources);

    if (Config.VERBOSE) {
      console.log('[SourceManager] ' + sourceCount + ' sources in room.');
    }
  }

  /**
   * Returns the first source from the list.
   *
   * @export
   * @returns {Source}
   */
  export function getFirstSource(): Source {
    return sources[0];
  }

}
