

export namespace MemoryManager {

  export var memory: Memory;

  export function loadMemory(): void {
    this.memory = Memory;
  }

  export function updateMemory(): void {
    this.cleanupCreepMemory();
    this.updateHarvestersMemory();
  }

  export function updateHarvestersMemory(): void {

  }

  export function cleanupCreepMemory(): void {
    // refactor: brought in from gameManager
    // clean up memory for deleted creeps
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        if (Config.VERBOSE) {
          console.log('[GameManager] Clearing non-existing creep memory:', name);
        }
        delete Memory.creeps[name];
      }
    }
  }
}
