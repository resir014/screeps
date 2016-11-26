import * as Config from "../../config/config";
import { log } from "../../utils/log";

export let sources: Source[];
export let sourceCount: number;
export let lookResults: LookAtResultMatrix | LookAtResultWithPos[];

/**
 * Refresh the available sources & mining positions.
 *
 * @export
 * @param {Room} room
 */
export function refreshAvailableSources(room: Room) {
  sources = room.find<Source>(FIND_SOURCES_ACTIVE);
  sourceCount = _.size(sources);

  if (Memory.rooms[room.name].unoccupied_mining_positions.length === 0) {
    sources.forEach((source: Source) => {
      // get an array of all adjacent terrain features near the spawn
      lookResults = source.room.lookForAtArea(
        LOOK_TERRAIN,
        source.pos.y - 1,
        source.pos.x - 1,
        source.pos.y + 1,
        source.pos.x + 1,
        true
      );

      for (let result of <LookAtResultWithPos[]> lookResults) {
        if (result.terrain === "plain" || result.terrain === "swamp") {
          Memory.rooms[room.name].unoccupied_mining_positions
            .push(new RoomPosition(result.x, result.y, source.room.name));
        }
      }
    });

    Memory.rooms[room.name].jobs.sourceMiningJobs = Memory.rooms[room.name].unoccupied_mining_positions.length;
  } else {
    Memory.rooms[room.name].jobs.sourceMiningJobs = Memory.rooms[room.name].unoccupied_mining_positions.length;
  }

  if (Config.ENABLE_DEBUG_MODE) {
    log.debug("[SourceManager] " + sourceCount + " source mining jobs available in room.");
  }
}
