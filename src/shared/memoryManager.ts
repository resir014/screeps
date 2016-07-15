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
    this.memory = Memory;
  }

  /**
   * Refreshes every memory entry of mining positions available on the room.
   *
   * @export
   * @param {Room} room The current room.
   */
  export function refreshMiningPositions(room: Room) {
    if (!MemoryManager.memory[room.name]) {
      MemoryManager.memory[room.name] = {};
    }
    if (!MemoryManager.memory[room.name]['unoccupied_mining_positions']) {
      MemoryManager.memory[room.name]['unoccupied_mining_positions'] = [];
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
    for (let name in MemoryManager.memory.creeps) {
      let creep: any = MemoryManager.memory.creeps[name];

      if (creep.room == room.name) {
        if (!Game.creeps[name]) {
          if (MemoryManager.memory.creeps[name]['role'] === 'sourceMiner') {
            MemoryManager.memory[room.name]['unOccupiedMiningPositions'].push(MemoryManager.memory.creeps[name]["occupiedMiningPosition"]);
          }

          delete MemoryManager.memory.creeps[name];
        }
      } else if (_.keys(MemoryManager.memory.creeps[name]).length == 0) {
        delete MemoryManager.memory.creeps[name];
      }
    }
  }

  /**
   * Update memory for a creep. This function will call whichever update function
   * is appropriate given the creep's role.
   *
   * @export
   */
  export function updateCreepMemory(creep: Creep): void {
    if (Config.VERBOSE) {
      console.log('[MemoryManager] Updating memory for creep:', creep.name);
    }

    updateSharedCreepMemory(creep);

    // FIXME HACK fuck this whole block. - shawn
    if (creep.memory.role == 'harvester')
      updateHarvestersMemory(creep);
    else if (creep.memory.role == 'builder')
      updateBuildersMemory(creep);
    else if (creep.memory.role == 'repairer')
      updateRepairersMemory(creep);
    else if (creep.memory.role == 'wallRepairer')
      updateWallRepairersMemory(creep);
    else if (creep.memory.role == 'upgrader')
      updateUpgradersMemory(creep);
  }

  /**
   * Update memory shared by many creeps (i.e. thru CreepAction superclass).
   */
  function updateSharedCreepMemory(creep: Creep): void {
    if (!creep.memory.renew_station_id) {
      creep.memory.renew_station_id = SpawnManager.getFirstSpawn()
        ? SpawnManager.getFirstSpawn().id
        : null;
    }
  }

  /**
   * Check the validity of an object ID stored in a creep's memory.
   *
   * Invalid values are null, undefined, empty strings, or do not exist as an
   * object in `Game`.
   *
   * @param {any} creep The creep whose memory we are managing
   * @param {any} key The memory key whose validity we will be checking
   * @returns {boolean} true if the creep exists, and if the object ID exists
   *                    and is valid
   */
  function checkObjectIdValidity(creep, key): boolean {
    /* TODO */
    if (creep == null) return false;

    let value: string = <string>creep.memory[key];
    let isValid: boolean = (
      (value != null) &&
      (value !== '') &&
      (Game.getObjectById(value) != null)
    );

    if (!isValid && Config.VERBOSE) {
      console.log('[MemoryManager] ' + creep.name + ' has an invalid ID for ' + key);
    }

    return isValid;
  };


  /**
   * Update each harvester's target source and/or energy dropoff
   * TODO this is a hack and needs to be un-hacked
   */
  function updateHarvestersMemory(creep: Creep): void {

    // HACK: same hack as the others for this.
    let source: Source = SourceManager.sources[0];
    let dropoff: Spawn | Structure = StructureManager.getDropOffPoint();

    creep.memory.target_source_id = source ? source.id : null;
    creep.memory.target_energy_dropoff_id = dropoff ? dropoff.id : null;

    // check validity of target source
    if (!checkObjectIdValidity(creep, 'target_source_id')) {
      creep.memory.target_source_id = source ? source.id : null;
    }

    // check validity of energy dropoff
    if (!checkObjectIdValidity(creep, 'target_energy_dropoff_id')) {
      creep.memory.target_energy_dropoff_id = dropoff ? dropoff.id : null;
    }

  }


  /**
   * Update each builder's target site and refill point
   * TODO spread out builders. all just default to spawn always, never actually
   * target a container
   */
  function updateBuildersMemory(creep: Creep): void {

    // HACK: same hack as the others for this.
    let constructionSite: ConstructionSite = ConstructionSiteManager.getConstructionSite();
    creep.memory.target_construction_site_id = constructionSite ? constructionSite.id : null;

    // make sure the builder's target construction site still exists
    if (!checkObjectIdValidity(creep, 'target_construction_site_id')) {
      if (ConstructionSiteManager.constructionSiteCount > 0) {
        creep.memory.target_construction_site_id = constructionSite ? constructionSite.id : null;
      } else {
        console.log('[MemoryManager] there are no construction sites for ' + creep.name);
      }
    }

    // make sure the builder's target energy station exists
    if (!checkObjectIdValidity(creep, 'target_source_id') || !checkObjectIdValidity(creep, 'target_energy_station_id')) {
      // we'll find the second energy source on the list first to avoid congestion at spawn
      creep.memory.target_source_id = SourceManager.sourceCount > 1 ? SourceManager.sources[1].id : null;
      creep.memory.target_energy_station_id = SpawnManager.getFirstSpawn() ? SpawnManager.getFirstSpawn().id : null;
    }

  }


  /**
   * Update each repairer's target repair site and refill point.
   */
  function updateRepairersMemory(creep: Creep): void {

    // HACK: this happened to be here since for some reason we can't do null-checking on
    // target_repair_site_id. Well, either that or the fact that obsolete repair site ids won't resolve to null.
    creep.memory.target_repair_site_id = StructureManager.getStructuresToRepair()
      ? StructureManager.getStructuresToRepair().id
      : null;

    if (!checkObjectIdValidity(creep, 'target_repair_site_id')) {
      creep.memory.target_repair_site_id = StructureManager.getStructuresToRepair()
        ? StructureManager.getStructuresToRepair().id
        : null;
    }

    // energy station ID exists?
    if (!checkObjectIdValidity(creep, 'target_source_id') || !checkObjectIdValidity(creep, 'target_energy_station_id')) {
      // we'll find the second energy source on the list first to avoid congestion at spawn
      creep.memory.target_source_id = SourceManager.sourceCount > 1 ? SourceManager.sources[1].id : null;
      creep.memory.target_energy_station_id = SpawnManager.getFirstSpawn() ? SpawnManager.getFirstSpawn().id : null;
    }

  }

  /**
   * Update each wall repairer's target repair site and refill point.
   */
  function updateWallRepairersMemory(creep: Creep): void {

    // HACK: this happened to be here since for some reason we can't do null-checking on
    // target_repair_site_id. Well, either that or the fact that obsolete repair site ids won't resolve to null.
    creep.memory.target_repair_site_id = StructureManager.getDefensiveStructuresToRepair()
      ? StructureManager.getDefensiveStructuresToRepair().id
      : null;

    // target structure ID exists?
    if (!checkObjectIdValidity(creep, 'target_repair_site_id')) {
      creep.memory.target_repair_site_id = StructureManager.getDefensiveStructuresToRepair()
        ? StructureManager.getDefensiveStructuresToRepair().id
        : null;
    }

    // energy station ID exists?
    if (!checkObjectIdValidity(creep, 'target_source_id') || !checkObjectIdValidity(creep, 'target_energy_station_id')) {
      // we'll find the second energy source on the list first to avoid congestion at spawn
      creep.memory.target_source_id = SourceManager.sourceCount > 1 ? SourceManager.sources[1].id : null;
      creep.memory.target_energy_station_id = SpawnManager.getFirstSpawn() ? SpawnManager.getFirstSpawn().id : null;
    }

  }


  /**
   * Update each upgrader's target controller and refill point.
   */
  function updateUpgradersMemory(creep: Creep): void {

    if (!checkObjectIdValidity(creep, 'target_controller_id')) {
      creep.memory.target_controller_id = ControllerManager.controller.id;
    }

    // energy station ID exists?
    if (!checkObjectIdValidity(creep, 'target_source_id') || !checkObjectIdValidity(creep, 'target_energy_station_id')) {
      // we'll find the second energy source on the list first to avoid congestion at spawn
      creep.memory.target_source_id = SourceManager.getFirstSource() ? SourceManager.getFirstSource().id : null;
      creep.memory.target_energy_station_id = SpawnManager.getFirstSpawn() ? SpawnManager.getFirstSpawn().id : null;
    }

  }
}
