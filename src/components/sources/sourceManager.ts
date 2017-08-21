import { ENABLE_DEBUG_MODE } from '../../config/config'
import { log } from '../../lib/logger'

/**
 * Create an array of all sources in the room and update job entries where
 * available. This should ensure that each room has 1 harvester per source.
 *
 * @export
 * @param {Room} room The current room.
 */
export function refreshAvailableSources(room: Room): void {
  const sources: Source[] = room.find<Source>(FIND_SOURCES)

  if (room.memory.sources.length === 0) {
    sources.forEach((source: Source) => {
      // Create an array of all source IDs in the room
      room.memory.sources.push(source.id)
    })
  }

  if (ENABLE_DEBUG_MODE) {
    log.info(`${room.name}: ${_.size(sources)} source(s) in room.`)
  }

  // Update job assignments.
  room.memory.jobs.harvester = sources.length
}
