import { STATE_MOVING } from './states'

const runSpawning = (creep: Creep) => {
  if (!creep.spawning) {
    creep.memory.state = STATE_MOVING
    return
  }

  if (!creep.memory.init) {
    // TODO: possible block to add some init stuff
    creep.memory.init = true
  }
}

export default runSpawning
