import * as Inscribe from 'screeps-inscribe'

import { ENABLE_DEBUG_MODE } from '../../config/config'
import { blacklistedSources } from '../../config/jobs'
import { Logger } from '../../utils/logger'

/**
 * Create an array of all sources in the room and update job entries where
 * available. This should ensure that each room has 1 harvester per source.
 *
 * @export
 * @param {Room} room The current room.
 */
export function refreshAvailableSources(room: Room): void {
  const sources: Source[] = room.find<Source>(FIND_SOURCES)
  const roomMemory: RoomMemory = room.memory

  // We only push sources that aren't blacklisted.
  const filteredSources = sources.filter((source: Source) =>
    _.includes(blacklistedSources, source.id) === false)

  if (roomMemory.sources.length === 0) {
    sources.forEach((source: Source) => {
      roomMemory.sources.push(source.id)
    })
  } else {
    // If sources array exists in memory, filter out blacklisted sources.
    // TODO: This may not re-add sources to memory when we un-blacklist them.
    roomMemory.sources = roomMemory.sources.filter((source: string) => {
      return _.includes(blacklistedSources, source) === false
    })
  }

  roomMemory.jobs.harvester = filteredSources.length

  if (ENABLE_DEBUG_MODE) {
    const out = [
      `[${Inscribe.color('SourceManager', 'skyblue')}]`,
      `[${Inscribe.color(room.name, 'hotpink')}]`,
      `${_.size(sources)} source(s) in room.`
    ]
    Logger.debug(out.join(' '))
  }
}
