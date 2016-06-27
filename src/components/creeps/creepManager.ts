import { Config } from './../../config/config';
import { MemoryManager } from './../../shared/memoryManager';
import { SourceManager } from './../sources/sourceManager';
import { SpawnManager } from './../spawns/spawnManager';
import { ControllerManager } from './../controllers/controllerManager';
import { Harvester } from './harvester';
import { Upgrader } from './upgrader';
import { Builder } from './builder';
import { Repairer } from './repairer';

export namespace CreepManager {

  export var creeps: { Creep } = null;
  export var creepNames: string[] = [];
  export var creepCount: number = 0;

  /**
   * Loads and counts all available creeps.
   *
   * @export
   */
  export function loadCreeps(): void {
    this.creeps = Game.creeps;
    this.creepCount = _.size(this.creeps);

    _loadCreepNames();

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
    let bodyParts: string[] = [MOVE, MOVE, CARRY, WORK];
    let name: string = null;
    let properties: any = {
      role: 'harvester',
      target_source_id: SourceManager.getFirstSource().id,
      target_energy_dropoff_id: SpawnManager.getFirstSpawn().id,
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
    let bodyParts: string[] = [MOVE, MOVE, CARRY, WORK];
    let name: string = null;
    let properties: any = {
      role: 'upgrader',
      target_source_id: SourceManager.getFirstSource().id,
      target_energy_dropoff_id: SpawnManager.getFirstSpawn().id,
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
    let bodyParts: string[] = [MOVE, MOVE, CARRY, WORK];
    let name: string = null;
    let properties: any = {
      role: 'builder',
      target_source_id: SourceManager.getFirstSource().id,
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

    return 0;
  }

  export function createRepairer(): number | string {
    let bodyParts: string[] = [MOVE, MOVE, CARRY, WORK];
    let name: string = null;
    let properties: any = {
      role: 'repairer',
      target_source_id: SourceManager.getFirstSource().id,
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

    return 0;
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
  export function isHarvesterLimitFull(): boolean {
    let harvesters: Creep[] = [];

    // TODO: This should have some kind of load balancing. It's not useful to
    // create all the harvesters for all source points at the start.
    _.forEach(creeps, function (creep: Creep, creepName: string) {
      if (creep.memory.role == 'harvester') {
        harvesters.push(creep);
      }
    });

    return ((SourceManager.sourceCount * Config.MAX_HARVESTERS_PER_SOURCE) > harvesters.length);
  }

  /**
   * Checks if it's possible to create an upgrader.
   *
   * @export
   * @returns {boolean}
   */
  export function canCreateUpgrader(): boolean {
    let harvesters: Creep[] = [];
    let upgraders: Creep[] = [];

    _.forEach(creeps, function (creep: Creep, creepName: string) {
      if (creep.memory.role == 'harvester') {
        harvesters.push(creep);
      }
      if (creep.memory.role == 'upgrader') {
        upgraders.push(creep);
      }
    });

    if ((Config.MAX_UPGRADERS_PER_CONTROLLER > upgraders.length) && (harvesters.length != 0)) {
      // We still have enough room for the current controller.
      // We also already have a harvester.
      return true;
    } else {
      return false;
    }
  }

  /**
   * Checks if it's possible to create a builder.
   *
   * @export
   * @returns {boolean}
   */
  export function canCreateBuilder(): boolean {
    let builders: Creep[] = [];
    let harvesters: Creep[] = [];

    _.forEach(creeps, function (creep: Creep, creepName: string) {
      if (creep.memory.role == 'harvester') {
        harvesters.push(creep);
      }
      if (creep.memory.role == 'builder') {
        builders.push(creep);
      }
    });

    if ((Config.MAX_BUILDERS_IN_ROOM > builders.length) && (harvesters.length != 0)) {
      // Same deal, haven't reached builder limit, already have at least one harvester.
      return true;
    } else {
      return false;
    }
  }

  export function canCreateRepairer(): boolean {
    let builders: Creep[] = [];
    let harvesters: Creep[] = [];
    let repairers: Creep[] = [];

    _.forEach(creeps, function (creep: Creep, creepName: string) {
      if (creep.memory.role == 'harvester') {
        harvesters.push(creep);
      }
      if (creep.memory.role == 'builder') {
        builders.push(creep);
      }
      if (creep.memory.role == 'repairer') {
        repairers.push(creep);
      }
    });

    if ((Config.MAX_REPAIRERS_IN_ROOM > repairers.length) && (harvesters.length != 0)
      && (builders.length != 0)) {
      return true;
    } else {
      return false;
    }
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

}
