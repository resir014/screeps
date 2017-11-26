export const init = () => {
  if (!Memory.stats) {
    Memory.stats = {}
  }
}

export const record = () => {
  if (Memory.stats) {
    Memory.stats['gcl.progress'] = Game.gcl.progress
    Memory.stats['gcl.progressTotal'] = Game.gcl.progressTotal
    Memory.stats['gcl.level'] = Game.gcl.level
    Memory.stats['cpu.getUsed'] = Game.cpu.getUsed()
    Memory.stats['cpu.limit'] = Game.cpu.limit
    Memory.stats['cpu.bucket'] = Game.cpu.bucket
    Memory.stats['memory.size'] = RawMemory.get().length
    Memory.stats['market.credits'] = Game.market.credits
  }
}
