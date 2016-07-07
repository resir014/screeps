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

  export var memory: Memory;

  export function loadMemory(): void {
    this.memory = Memory;
  }

  /**
   * Clean up creep memory. Delete any creeps in memory that no longer exist in
   * the game.
   */
  export function cleanupCreepMemory(): void {
    // refactor: brought in from gameManager
    // clean up memory for deleted creeps
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        if (Config.VERBOSE) {
          console.log('[MemoryManager] Clearing non-existing creep memory:', name);
        }
        delete Memory.creeps[name];
      }
    }
  }

  export function updateCreepMemory(): void {
    updateSharedCreepMemory();
    updateHarvestersMemory();
    updateBuildersMemory();
    updateRepairersMemory();
    updateWallRepairersMemory();
    updateUpgradersMemory();
  }

  /**
   * Update memory shared by many creeps (i.e. thru CreepAction superclass)
   */
  function updateSharedCreepMemory(): void {
    _.each(CreepManager.creeps, (creep: Creep) => {

      if (!creep.memory.renew_station_id) {
        creep.memory.renew_station_id = SpawnManager.getFirstSpawn() ? SpawnManager.getFirstSpawn().id : null;
      }

    });
  }

  /**
   * Check the validity of an object ID stored in a creep's memory.
   *
   * Invalid values are null, undefined, empty strings, or do not exist as an
   * object in `Game`.
   *
   * Returns true if the creep exists, and if the object ID exists and is valid
   *
   * @param creep The creep whose memory we are managing
   * @param key The memory key whose validity we will be checking
   */
  function checkObjectIdValidity(creep, key): boolean {
    /* TODO */
    if (creep == null) return false;

    let value: string = <string> creep.memory[key];
    var isValid: boolean = (
      (value != null) &&
      (value !== '')  &&
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
  function updateHarvestersMemory(): void {

    // pull harvesters from CreepManager
    _.each(CreepManager.harvesters, (creep: Creep) => {

      // check validity of target source
      if (!checkObjectIdValidity(creep, 'target_source_id')) {
        creep.memory.target_source_id = SourceManager.getFirstSource().id;
      }

      // check validity of energy dropoff
      if (!checkObjectIdValidity(creep, 'target_energy_dropoff_id')) {
        var dropoff: Spawn | Structure = StructureManager.getDropOffPoint();
        creep.memory.target_energy_dropoff_id = dropoff ? dropoff.id : null;
      }

    });
  }


  /**
   * Update each builder's target site and refill point
   * TODO spread out builders. all just default to spawn always, never actually
   * target a container
   */
  function updateBuildersMemory(): void {

    _.each(CreepManager.builders, (creep: Creep) => {

      // make sure the builder's target construction site still exists
      if (!checkObjectIdValidity(creep, 'target_construction_site_id')) {
        if (ConstructionSiteManager.constructionSiteCount > 0) {
          creep.memory.target_construction_site_id = ConstructionSiteManager.getFirstConstructionSite().id;
        } else {
          console.log('[MemoryManager] there are no construction sites for ' + creep.name);
        }
      }

      // make sure the builder's target energy station exists
      if (!checkObjectIdValidity(creep, 'target_source_id') || !checkObjectIdValidity(creep, 'target_energy_station_id')) {
        // we'll find the second energy source on the list first to avoid congestion at spawn
        creep.memory.target_source_id = SourceManager.sourceCount > 1 ? SourceManager.sources[1].id : null;
        creep.memory.target_energy_station_id = creep.memory.target_source_id == null ?
          SpawnManager.getFirstSpawn().id : null;
      }

    });

  }


  /**
   * Update each repairer's target repair site and refill point.
   */
  function updateRepairersMemory(): void {

    _.each(CreepManager.repairers, (creep: Creep) => {

      // HACK: this happened to be here since for some reason we can't do null-checking on
      // target_repair_site_id. Well, either that or the fact that obsolete repair site ids won't resolve to null.
      creep.memory.target_repair_site_id = StructureManager.getStructuresToRepair() ?
        StructureManager.getStructuresToRepair().id : null;

      if (!checkObjectIdValidity(creep, 'target_repair_site_id')) {
        creep.memory.target_repair_site_id = StructureManager.getStructuresToRepair() ?
          StructureManager.getStructuresToRepair().id : null;
      }

      // energy station ID exists?
      if (!checkObjectIdValidity(creep, 'target_source_id') || !checkObjectIdValidity(creep, 'target_energy_station_id')) {
        // we'll find the second energy source on the list first to avoid congestion at spawn
        creep.memory.target_source_id = SourceManager.sourceCount > 1 ? SourceManager.sources[1].id : null;
        creep.memory.target_energy_station_id = creep.memory.target_source_id == null ?
          SpawnManager.getFirstSpawn().id : null;
      }

    });

  }

  /**
   * Update each wall repairer's target repair site and refill point.
   */
  function updateWallRepairersMemory(): void {

    _.each(CreepManager.wallRepairers, (creep: Creep) => {

      // HACK: this happened to be here since for some reason we can't do null-checking on
      // target_repair_site_id. Well, either that or the fact that obsolete repair site ids won't resolve to null.
      creep.memory.target_repair_site_id = StructureManager.getDefensiveStructuresToRepair() ?
        StructureManager.getDefensiveStructuresToRepair().id : null;

      // target structure ID exists?
      if (!checkObjectIdValidity(creep, 'target_repair_site_id')) {
        creep.memory.target_repair_site_id = StructureManager.getDefensiveStructuresToRepair() ?
          StructureManager.getDefensiveStructuresToRepair().id : null;
      }

      // energy station ID exists?
      if (!checkObjectIdValidity(creep, 'target_source_id') || !checkObjectIdValidity(creep, 'target_energy_station_id')) {
        // we'll find the second energy source on the list first to avoid congestion at spawn
        creep.memory.target_source_id = SourceManager.sourceCount > 1 ? SourceManager.sources[1].id : null;
        creep.memory.target_energy_station_id = creep.memory.target_source_id == null ?
          SpawnManager.getFirstSpawn().id : null;
      }

    });

  }


  /**
   * Update each upgrader's target controller and refill point.
   */
  function updateUpgradersMemory(): void {

    _.each(CreepManager.upgraders, (creep: Creep) => {

      if (!checkObjectIdValidity(creep, 'target_controller_id')) {
        creep.memory.target_controller_id = ControllerManager.getController().id;
      }

      // energy station ID exists?
      if (!checkObjectIdValidity(creep, 'target_source_id') || !checkObjectIdValidity(creep, 'target_energy_station_id')) {
        // we'll find the second energy source on the list first to avoid congestion at spawn
        creep.memory.target_source_id = SourceManager.getFirstSource() ? SourceManager.getFirstSource().id : null;
        creep.memory.target_energy_station_id = creep.memory.target_source_id == null ?
          SpawnManager.getFirstSpawn().id : null;
      }

    });

  }
}
