import { run } from '../harvester'

const runMoving = (creep: Creep, transitionState: number) => {
  if (creep.memory.target.id) {
    const targetSource = Game.getObjectById<Source>(creep.memory.target.id)

    if (targetSource) {
      if (creep.pos.isNearTo(targetSource)) {
        creep.memory.state = transitionState
        run(creep)
      }
    }
  }
}

export default runMoving
