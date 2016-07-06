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
   * Update each harvester's target source and/or energy dropoff
   * TODO this is a hack and needs to be un-hacked
   */
  function updateHarvestersMemory(): void {

    // pull harvesters from GameManager
    _.each(CreepManager.harvesters, (creep: Creep) => {

      // make sure the harvester's target source still exists
      if (!creep.memory.target_source_id || Game.getObjectById(creep.memory.target_source_id) == null) {
        if (Config.VERBOSE) {
          console.log('[MemoryManager] Updating outdated source ID for ' + creep.name);
        }

        creep.memory.target_source_id = SourceManager.getFirstSource().id;
      }

      // HACK: if we use the same method as above, it somehow won't work. Therefore we just use this weird check
      if (StructureManager.getDropOffPoint()) {
        if (Config.VERBOSE) {
          console.log('[MemoryManager] Updating outdated energy dropoff ID for ' + creep.name);
        }

        creep.memory.target_energy_dropoff_id = StructureManager.getDropOffPoint().id;
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
      if (!creep.memory.target_construction_site_id || Game.getObjectById(creep.memory.target_construction_site_id) == null) {
        if (Config.VERBOSE) {
          console.log('[MemoryManager] Updating outdated construction site ID for ' + creep.name);
        }

        creep.memory.target_construction_site_id = ConstructionSiteManager.getConstructionSite() ?
          ConstructionSiteManager.getConstructionSite().id : null;
      }

      // make sure the builder's target energy station exists
      if (!creep.memory.target_energy_station_id || Game.getObjectById(creep.memory.target_energy_station_id) == null) {
        if (Config.VERBOSE) {
          console.log('[MemoryManager] Updating outdated energy station ID for ' + creep.name);
        }

        // we'll find the second energy source on the list first to avoid congestion at spawn
        creep.memory.target_source_id = SourceManager.sourceCount > 1 ?
          SourceManager.sources[1].id : null;

        creep.memory.target_energy_station_id = creep.memory.target_source_id == null ?
          SpawnManager.getFirstSpawn().id : null;

        // creep.memory.target_energy_station_id = SpawnManager.getFirstSpawn() ? SpawnManager.getFirstSpawn().id : null;
      }

    });

  }


  /**
   * Update each repairer's target repair site and refill point.
   */
  function updateRepairersMemory(): void {

    _.each(CreepManager.repairers, (creep: Creep) => {

      creep.memory.target_repair_site_id = StructureManager.getStructuresToRepair() ?
        StructureManager.getStructuresToRepair().id : null;

      // we'll find the second energy source on the list first to avoid congestion at spawn
      creep.memory.target_source_id = SourceManager.sourceCount > 1 ?
        SourceManager.sources[1].id : null;

      creep.memory.target_energy_station_id = creep.memory.target_source_id == null ?
        SpawnManager.getFirstSpawn().id : null;

      // target structure ID exists?
      if (!creep.memory.target_repair_site_id || Game.getObjectById(creep.memory.target_repair_site_id) == null) {
        if (Config.VERBOSE) {
          console.log('[MemoryManager] Updating outdated target repair site ID for ' + creep.name);
        }

        creep.memory.target_repair_site_id = StructureManager.getStructuresToRepair() ?
          StructureManager.getStructuresToRepair().id : null;
      }

      // energy station ID exists?
      if (!creep.memory.target_energy_station_id || Game.getObjectById(creep.memory.target_energy_station_id) == null) {
        if (Config.VERBOSE) {
          console.log('[MemoryManager] Updating outdated target energy station ID for ' + creep.name);
        }

        // we'll find the second energy source on the list first to avoid congestion at spawn
        creep.memory.target_source_id = SourceManager.sourceCount > 1 ?
          SourceManager.sources[1].id : null;

        creep.memory.target_energy_station_id = creep.memory.target_source_id == null ?
          SpawnManager.getFirstSpawn().id : null;

        // creep.memory.target_energy_station_id = SpawnManager.getFirstSpawn() ? SpawnManager.getFirstSpawn().id : null;
      }

    });

  }

  /**
   * Update each wall repairer's target repair site and refill point.
   */
  function updateWallRepairersMemory(): void {

    _.each(CreepManager.wallRepairers, (creep: Creep) => {

      creep.memory.target_repair_site_id = StructureManager.getDefensiveStructuresToRepair() ?
        StructureManager.getDefensiveStructuresToRepair().id : null;

      // we'll find the second energy source on the list first to avoid congestion at spawn
      creep.memory.target_source_id = SourceManager.sourceCount > 1 ?
        SourceManager.sources[1].id : null;

      creep.memory.target_energy_station_id = creep.memory.target_source_id == null ?
        SpawnManager.getFirstSpawn().id : null;

      // target structure ID exists?
      if (!creep.memory.target_repair_site_id || Game.getObjectById(creep.memory.target_repair_site_id) == null) {
        if (Config.VERBOSE) {
          console.log('[MemoryManager] Updating outdated target repair site ID for ' + creep.name);
        }

        creep.memory.target_repair_site_id = StructureManager.getDefensiveStructuresToRepair() ?
          StructureManager.getDefensiveStructuresToRepair().id : null;
      }

      // energy station ID exists?
      if ((!creep.memory.target_energy_station_id || Game.getObjectById(creep.memory.target_energy_station_id) == null)
        || (!creep.memory.target_source_id || Game.getObjectById(creep.memory.target_source_id) == null)) {
        if (Config.VERBOSE) {
          console.log('[MemoryManager] Updating outdated target energy station ID for ' + creep.name);
        }

        // we'll find the second energy source on the list first to avoid congestion at spawn
        creep.memory.target_source_id = SourceManager.sourceCount > 1 ?
          SourceManager.sources[1].id : null;

        creep.memory.target_energy_station_id = creep.memory.target_source_id == null ?
          SpawnManager.getFirstSpawn().id : null;

        // creep.memory.target_energy_station_id = SpawnManager.getFirstSpawn() ? SpawnManager.getFirstSpawn().id : null;
      }

    });

  }


  /**
   * Update each upgrader's target controller and refill point.
   */
  function updateUpgradersMemory(): void {

    _.each(CreepManager.upgraders, (creep: Creep) => {

      if (!creep.memory.target_controller_id || !Game.getObjectById(creep.memory.target_controller_id)) {
        if (Config.VERBOSE) {
          console.log('[MemoryManager] Updating outdated controller ID for ' + creep.name);
        }

        creep.memory.target_controller_id = ControllerManager.getController().id;
      }

      if (!creep.memory.target_energy_station_id || !Game.getObjectById(creep.memory.target_energy_station_id)) {
        if (Config.VERBOSE) {
          console.log('[MemoryManager] Updating outdated target energy station ID for ' + creep.name);
        }

        // we'll find the second energy source on the list first to avoid congestion at spawn
        creep.memory.target_source_id = SourceManager.getFirstSource() ?
          SourceManager.getFirstSource().id : null;

        creep.memory.target_energy_station_id = creep.memory.target_source_id == null ?
          SpawnManager.getFirstSpawn().id : null;
      }

    });

  }
}
