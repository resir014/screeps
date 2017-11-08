import { runSingleCreep } from '../creepManager'

const movingState = (creep: Creep, transitionState: number) => {
  if (creep.memory.target.id) {
    const target = Game.getObjectById<RoomObject>(creep.memory.target.id)

    if (target) {
      if (creep.pos.isNearTo(target)) {
        creep.memory.state = transitionState
        runSingleCreep(creep)
      } else {
        creep.travelTo(target)
      }
    }
  }
}

export default movingState
