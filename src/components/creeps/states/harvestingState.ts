import { STATE_MOVING } from '../stateCodes'
import { runSingleCreep } from '../creepManager'

const harvestingState = (creep: Creep) => {
  const target = Game.getObjectById<Source>(creep.memory.target.id)

  if (target) {
    if (creep.pos.isNearTo(target)) {
      creep.harvest(target)
    } else {
      // Creep is not near an energy source yet, so we go back to moving state
      creep.memory.state = STATE_MOVING
      runSingleCreep(creep)
    }
  }
}

export default harvestingState
