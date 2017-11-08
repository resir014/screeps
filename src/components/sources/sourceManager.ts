import * as Inscribe from 'screeps-inscribe'

import { ENABLE_DEBUG_MODE } from '../../config/constants'
import { blacklistedSources } from '../../config/jobs'
import * as Logger from '../../utils/logger'

// import { filterCreepsByRole, getCreepsInRoom } from '../creeps/creepManager'
import { enqueueSpawnRequest, filterSpawnQueueByCreepRole } from '../spawns/spawnQueue'

/**
 * Create an array of all sources in the room and update job entries where
 * available. This should ensure that each room has 1 harvester per source.
 *
 * @export
 * @param {Room} room The current room.
 */
export function refreshAvailableSources(room: Room): void {
  const sources: Source[] = room.find<Source>(FIND_SOURCES)

  // We only push sources that aren't blacklisted.
  const filteredSources = sources.filter((source: Source) =>
    _.includes(blacklistedSources, source.id) === false)

  // TODO: Better checking that's aware of harvesters + their assigned sources.
  // - Can we push new jobs as soon as a harvester dies?
  // - What about blacklisted resources?
  if (filterSpawnQueueByCreepRole(room, 'harvester').length === 0) {
    filteredSources.forEach((source: Source) => {
      enqueueSpawnRequest(room, {
        role: 'harvester',
        priority: 2,
        target: {
          room: room.name,
          id: source.id
        }
      })
    })
  }

  if (ENABLE_DEBUG_MODE) {
    const out = [
      `[${Inscribe.color('SourceManager', 'skyblue')}]`,
      `[${Inscribe.color(room.name, 'hotpink')}]`,
      `${_.size(sources)} source(s) in room.`
    ]
    Logger.debug(out.join(' '))
  }
}
