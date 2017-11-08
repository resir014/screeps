import * as StateCodes from '../stateCodes'
import spawningState from '../states/spawningState'
import movingState from '../states/movingState'

export const run = (creep: Creep) => {
  if (!creep.memory.state) {
    creep.memory.state = StateCodes.STATE_SPAWNING
  }

  switch (creep.memory.state) {
    case StateCodes.STATE_SPAWNING:
      spawningState(creep)
      break
    case StateCodes.STATE_MOVING:
      movingState(creep, StateCodes.STATE_HARVESTING)
      break
  }
}

export default run
