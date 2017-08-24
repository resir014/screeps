import { ENABLE_DEBUG_MODE } from '../../config/config'
import { blacklistedSources } from '../../config/jobs'
import { log } from '../../utils/logger'
import * as Inscribe from '../../lib/Inscribe'

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
      // We only push sources that aren't blacklisted.
      if (_.includes(blacklistedSources, source.id) === false) {
        room.memory.sources.push(source.id)
      }
    })

    room.memory.jobs.harvester = sources.length
  } else {
    // If sources array exists in memory, filter out blacklisted sources.
    room.memory.sources = _.filter((room.memory.sources as string[]), (id: string) => {
      return _.includes(blacklistedSources, id) === false
    })
  }

  if (ENABLE_DEBUG_MODE) {
    const out = [
      `[${Inscribe.color('SourceManager', 'skyblue')}]`,
      `[${Inscribe.color(room.name, 'hotpink')}]`,
      `${_.size(sources)} source(s) in room.`
    ]
    log.debug(out.join(' '))
  }
}
