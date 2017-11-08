import { STATE_MOVING } from '../stateCodes'
import { runSingleCreep } from '../creepManager'

const spawningState = (creep: Creep) => {
  if (!creep.spawning) {
    creep.memory.state = STATE_MOVING
    // Immediately run the next state
    runSingleCreep(creep)
    return
  }

  if (!creep.memory.init) {
    // TODO: possible block to add some init stuff
    creep.memory.init = true
  }
}

export default spawningState
