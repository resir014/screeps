import { Config } from './../../config/config';
import { MemoryManager } from './../../shared/memoryManager';
import { SourceManager } from './../sources/sourceManager';
import { SpawnManager } from './../spawns/spawnManager';
import { StructureManager } from './../structures/structureManager';
import { ConstructionSiteManager } from './../constructionSites/constructionSiteManager';
import { ControllerManager } from './../controllers/controllerManager';
import { Harvester } from './harvester';
import { Upgrader } from './upgrader';
import { Builder } from './builder';
import { Repairer } from './repairer';

export namespace CreepManager {

  export var creeps: { Creep } = null;
  export var creepNames: string[] = [];
  export var creepCount: number = 0;

  export var harvesters: Creep[] = [];
  export var upgraders: Creep[] = [];
  export var builders: Creep[] = [];
  export var repairers: Creep[] = [];

  /**
   * Loads and counts all available creeps.
   *
   * @export
   */
  export function loadCreeps(): void {
    this.creeps = Game.creeps;
    this.creepCount = _.size(this.creeps);

    _loadCreepNames();
    _loadCreepRoleCounts();

    if (Config.VERBOSE) {
      console.log('[CreepManager] ' + this.creepCount + ' creeps found in the playground.');
    }
  }

  /**
   * Creates a new Harvester creep.
   *
   * @export
   * @returns {number}
   */
  export function createHarvester(): number | string {
    let dropoff_id: string = StructureManager.getDropOffPoint() ?
      StructureManager.getDropOffPoint().id :
      SpawnManager.getFirstSpawn().id;

    let bodyParts: string[] = [MOVE, MOVE, CARRY, WORK];
    let name: string = null;
    let properties: any = {
      role: 'harvester',
      target_source_id: SourceManager.getFirstSource().id,
      target_energy_dropoff_id: dropoff_id,
      renew_station_id: SpawnManager.getFirstSpawn().id
    };

    var status: number | string = SpawnManager.getFirstSpawn().canCreateCreep(bodyParts, name);
    if (status == OK) {
      status = SpawnManager.getFirstSpawn().createCreep(bodyParts, name, properties);

      if (Config.VERBOSE) {
        console.log('[CreepManager] Started creating new Harvester');
      }
    }

    return status;
  }

  /**
   * Creates a new upgrader creep.
   *
   * @export
   * @returns {number}
   */
  export function createUpgrader(): number | string {
    let targetSource_id: string = SourceManager.sourceCount > 1 ?
      SourceManager.sources[1].id : null;
    let energyStation_id: string = targetSource_id == null ?
      SpawnManager.getFirstSpawn().id : null;

    let bodyParts: string[] = [MOVE, MOVE, CARRY, WORK];
    let name: string = null;
    let properties: any = {
      role: 'upgrader',
      target_controller_id: ControllerManager.getController().id,
      target_source_id: targetSource_id,
      target_energy_station_id: energyStation_id,
      renew_station_id: SpawnManager.getFirstSpawn().id,
      upgrading: false
    };

    var status: number | string = SpawnManager.getFirstSpawn().canCreateCreep(bodyParts, name);
    if (status == OK) {
      status = SpawnManager.getFirstSpawn().createCreep(bodyParts, name, properties);

      if (Config.VERBOSE) {
        console.log('[CreepManager] Started creating new Upgrader');
      }
    }

    return status;
  }

  export function createBuilder(): number | string {
    let targetSource_id: string = SourceManager.sourceCount > 1 ?
      SourceManager.sources[1].id : null;
    let energyStation_id: string = targetSource_id == null ?
      SpawnManager.getFirstSpawn().id : null;
    let constructionSite_id: string = ConstructionSiteManager.getConstructionSite() ?
      ConstructionSiteManager.getConstructionSite().id : null;

    let bodyParts: string[] = [MOVE, MOVE, CARRY, WORK];
    let name: string = null;
    let properties: any = {
      role: 'builder',
      target_construction_site_id: constructionSite_id,
      target_source_id: targetSource_id,
      target_energy_station_id: energyStation_id,
      renew_station_id: SpawnManager.getFirstSpawn().id,
      building: false
    }

    var status: number | string = SpawnManager.getFirstSpawn().canCreateCreep(bodyParts, name);
    if (status == OK) {
      status = SpawnManager.getFirstSpawn().createCreep(bodyParts, name, properties);

      if (Config.VERBOSE) {
        console.log('[CreepManager] Started creating new Builder');
      }
    }

    return status;
  }

  export function createRepairer(): number | string {
    let targetSource_id: string = SourceManager.sourceCount > 1 ?
      SourceManager.sources[1].id : null;
    let energyStation_id: string = targetSource_id == null ?
      SpawnManager.getFirstSpawn().id : null;
    // let energyStation_id: string = StructureManager.getStorageObject() ?
    //   StructureManager.getStorageObject().id :
    //   SpawnManager.getFirstSpawn().id;
    let toRepair_id: string = StructureManager.getStructuresToRepair() ?
      StructureManager.getStructuresToRepair().id : null;

    if (!toRepair_id) {
      toRepair_id = StructureManager.getWallsToRepair() ?
        StructureManager.getWallsToRepair().id : null;
    }

    let bodyParts: string[] = [MOVE, MOVE, CARRY, WORK];
    let name: string = null;
    let properties: any = {
      role: 'repairer',
      target_repair_site_id: StructureManager.getStructuresToRepair().id,
      target_source_id: targetSource_id,
      target_energy_station_id: energyStation_id,
      renew_station_id: SpawnManager.getFirstSpawn().id,
      repairing: false
    }

    var status: number | string = SpawnManager.getFirstSpawn().canCreateCreep(bodyParts, name);
    if (status == OK) {
      status = SpawnManager.getFirstSpawn().createCreep(bodyParts, name, properties);

      if (Config.VERBOSE) {
        console.log('[CreepManager] Started creating new Builder');
      }
    }

    return status;
  }

  /**
   * Trigger action methods for all Harvester creeps.
   *
   * @export
   */
  export function harvestersGoToWork(): void {

    let harvesters: Harvester[] = [];
    _.forEach(this.creeps, function (creep: Creep, creepName: string) {
      if (creep.memory.role == 'harvester') {
        let harvester = new Harvester();
        harvester.setCreep(creep);
        harvester.action();

        harvesters.push(harvester);
      }
    });

    if (Config.VERBOSE) {
      console.log('[CreepManager] ' + harvesters.length + ' harvesters reported on duty today!');
    }

  }

  /**
   * Trigger action methods for all Upgrader creeps.
   *
   * @export
   */
  export function upgradersGoToWork(): void {

    let upgraders: Upgrader[] = [];
    _.forEach(this.creeps, function (creep: Creep, creepName: string) {
      if (creep.memory.role == 'upgrader') {
        let upgrader = new Upgrader();
        upgrader.setCreep(creep);
        // Next move for harvester
        upgrader.action();

        // Save harvester to collection
        upgraders.push(upgrader);
      }
    });

    if (Config.VERBOSE) {
      console.log('[CreepManager] ' + upgraders.length + ' upgraders reported on duty today!');
    }

  }

  /**
   * Trigger action methods for all Builder creeps.
   *
   * @export
   */
  export function buildersGoToWork(): void {

    let builders: Builder[] = [];
    _.forEach(this.creeps, function (creep: Creep, creepName: string) {
      if (creep.memory.role == 'builder') {
        let builder = new Builder();
        builder.setCreep(creep);
        builder.action();

        builders.push(builder);
      }
    });

    if (Config.VERBOSE) {
      console.log('[CreepManager] ' + builders.length + ' builders reported on duty today!');
    }

  }

  /**
   * Trigger action methods for all Repairer creeps.
   *
   * @export
   */
  export function repairersGoToWork(): void {

    let repairers: Repairer[] = [];
    _.forEach(this.creeps, function (creep: Creep, creepName: string) {
      if (creep.memory.role == 'repairer') {
        let repairer = new Repairer();
        repairer.setCreep(creep);
        repairer.action();

        repairers.push(repairer);
      }
    });

    if (Config.VERBOSE) {
      console.log('[CreepManager] ' + repairers.length + ' repairers reported on duty today!');
    }

  }

  /**
   * Checks if there's enough harvesters handling a certain source.
   *
   * @export
   * @returns {boolean}
   */
  export function canCreateHarvester(): boolean {
    // TODO: This should have some kind of load balancing. It's not useful to
    // create all the harvesters for all source points at the start.

    // return ((SourceManager.sourceCount * Config.MAX_HARVESTERS_PER_SOURCE) > harvesters.length);
    return ((Config.MAX_HARVESTERS_PER_SOURCE > harvesters.length) || (harvesters.length < 2));
  }

  /**
   * Checks if it's possible to create an upgrader.
   *
   * @export
   * @returns {boolean}
   */
  export function canCreateUpgrader(): boolean {
    // We still have enough room for the current controller.
    // We also already have a harvester.
    return (Config.MAX_UPGRADERS_PER_CONTROLLER > upgraders.length);
  }

  /**
   * Checks if it's possible to create a builder.
   *
   * @export
   * @returns {boolean}
   */
  export function canCreateBuilder(): boolean {
    return (Config.MAX_BUILDERS_IN_ROOM > builders.length);
  }

  /**
   * Checks if it's possible to create a repairer.
   *
   * @export
   * @returns {boolean}
   */
  export function canCreateRepairer(): boolean {
    return (Config.MAX_REPAIRERS_IN_ROOM > repairers.length);
  }

  /**
   * Loads all Creep names.
   */
  function _loadCreepNames(): void {
    for (let creepName in creeps) {
      if (creeps.hasOwnProperty(creepName)) {
        creepNames.push(creepName);
      }
    }
  }

  function _loadCreepRoleCounts(): void {
    // TODO: find a way to avoid API calls.
    harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
  }

}
