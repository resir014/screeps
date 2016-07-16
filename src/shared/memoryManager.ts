import { Config } from './../config/config';
import { GameManager } from './../gameManager';
import { CreepManager } from './../components/creeps/creepManager';
import { SpawnManager } from './../components/spawns/spawnManager';
import { SourceManager } from './../components/sources/sourceManager';
import { StructureManager } from './../components/structures/structureManager';
import { ControllerManager } from './../components/controllers/controllerManager';
import { ConstructionSiteManager } from './../components/constructionSites/constructionSiteManager';

// TODO this namespace is as DRY as the ocean
export namespace MemoryManager {

  export let memory: Memory;

  export function loadMemory(): void {
    memory = Memory;
  }

  /**
   * Refreshes every memory entry of mining positions available on the room.
   *
   * @export
   * @param {Room} room The current room.
   */
  export function refreshMiningPositions(room: Room) {
    if (!memory[room.name]) {
      if (Config.VERBOSE) {
        console.log('[MemoryManager] Refreshing mining positions...');
      }
      memory[room.name] = {};
    }
    if (!memory[room.name]['unoccupied_mining_positions']) {
      if (Config.VERBOSE) {
        console.log('[MemoryManager] Refreshing mining positions...');
      }
      memory[room.name]['unoccupied_mining_positions'] = [];
    }
  }

  /**
   * Clean up creep memory. Delete any creeps in memory that no longer exist in
   * the game.
   *
   * @export
   * @param {Room} room The current room.
   */
  export function cleanupCreepMemory(room: Room): void {
    // refactor: brought in from gameManager
    // clean up memory for deleted creeps
    for (let name in memory.creeps) {
      let creep: any = memory.creeps[name];

      if (creep.room === room.name) {
        if (!Game.creeps[name]) {
          if (Config.VERBOSE) {
            console.log('[MemoryManager] Clearing non-existing creep memory:', name);
          }

          if (memory.creeps[name]['role'] === 'sourceMiner') {
            memory[room.name]['unoccupied_mining_positions'].push(memory.creeps[name]['occupied_mining_position']);
          }

          delete memory.creeps[name];
        }
      } else if (_.keys(memory.creeps[name]).length === 0) {
        if (Config.VERBOSE) {
          console.log('[MemoryManager] Clearing non-existing creep memory:', name);
        }
        delete memory.creeps[name];
      }
    }
  }

}
