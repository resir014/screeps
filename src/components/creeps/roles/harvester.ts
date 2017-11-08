import * as StateCodes from './harvester/states'
import runSpawning from './harvester/runSpawning'
import runMoving from './harvester/runMoving'

export const run = (creep: Creep) => {
  if (!creep.memory.state) {
    creep.memory.state
  }

  switch (creep.memory.state) {
    case StateCodes.STATE_SPAWNING:
      runSpawning(creep)
      break
    case StateCodes.STATE_MOVING:
      runMoving(creep, StateCodes.STATE_HARVESTING)
      break
  }
}

export default run
