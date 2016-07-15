import { Config } from './../../config/config';
import { RoomManager } from './../rooms/roomManager';
import { JobManager } from './../jobs/jobManager';
import { MemoryManager } from './../../shared/memoryManager';

export namespace SourceManager {

  export let sources: Source[];
  export let sourceCount: number;
  export let lookResults: LookAtResultMatrix | LookAtResultWithPos[]

  /**
   * Initialization scripts for the SourceManager namespace.
   *
   * @export
   * @param {Room} room
   */
  export function load(room: Room) {
    sources = room.find<Source>(FIND_SOURCES_ACTIVE);
    sourceCount = _.size(sources);

    if (MemoryManager.memory[room.name]['unoccupied_mining_positions'].length == 0) {
      sources.forEach((source: Source) => {
        //get an array of all adjacent terrain features near the spawn
        lookResults = source.room.lookForAtArea(
          LOOK_TERRAIN,
          source.pos.y - 1,
          source.pos.x - 1,
          source.pos.y + 1,
          source.pos.x + 1,
          true
        );

        for (let result of <LookAtResultWithPos[]>lookResults) {
          if (result.terrain == 'plain' || result.terrain == 'swamp') {
            MemoryManager.memory[room.name]['unoccupied_mining_positions'].push(new RoomPosition(result.x, result.y, source.room.name));
          }
        }
      });

      JobManager.sourceMiningJobs = MemoryManager.memory[room.name]['unoccupied_mining_positions'].length;
    } else {
      JobManager.sourceMiningJobs = MemoryManager.memory[room.name]['unoccupied_mining_positions'].length;
    }

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
