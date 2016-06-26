import { Config } from './../../config/config';
import { MemoryManager } from './../../shared/memoryManager';
import { SourceManager } from './../sources/sourceManager';
import { SpawnManager } from './../spawns/spawnManager';
import { ControllerManager } from './../controllers/controllerManager';
import { Harvester } from './harvester';
import { Upgrader } from './upgrader';

export namespace CreepManager {

  export var creeps: {Creep} = null;
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
  export function createHarvester(): number {
    let bodyParts: string[] = [MOVE, MOVE, CARRY, WORK];
    let name: string = null;
    let properties: any = {
      role: 'harvester',
      target_source_id: SourceManager.getFirstSource().id,
      target_energy_dropoff_id: SpawnManager.getFirstSpawn().id,
      renew_station_id: SpawnManager.getFirstSpawn().id
    };

    var status: number = SpawnManager.getFirstSpawn().canCreateCreep(bodyParts, name);
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
  export function createUpgrader(): number {
    let bodyParts: string[] = [MOVE, MOVE, CARRY, WORK];
    let name: string = null;
    let properties: any = {
      role: 'upgrader',
      target_source_id: SourceManager.getFirstSource().id,
      target_energy_dropoff_id: SpawnManager.getFirstSpawn().id,
      renew_station_id: SpawnManager.getFirstSpawn().id
    };

    var status: number = SpawnManager.getFirstSpawn().canCreateCreep(bodyParts, name);
    if (status == OK) {
      status = SpawnManager.getFirstSpawn().createCreep(bodyParts, name, properties);

      if (Config.VERBOSE) {
        console.log('[CreepManager] Started creating new Upgrader');
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
        // Next move for harvester
        harvester.action();

        // Save harvester to collection
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
   * Checks if there's enough harvesters handling a certain source.
   *
   * @export
   * @returns {boolean}
   */
  export function isHarvesterLimitFull(): boolean {
    let harvesterCount: number = 0;

    // TODO: This should have some kind of load balancing. It's not useful to
    // create all the harvesters for all source points at the start.
    _.forEach(creeps, function (creep: Creep, creepName: string) {
      if (creep.memory.role == 'harvester') {
        harvesterCount++;
      }
    });

    return ((SourceManager.sourceCount * Config.MAX_HARVESTERS_PER_SOURCE) >= harvesterCount);
  }

  /**
   * Checks if it's possible can create an upgrader.
   *
   * @export
   * @returns {boolean}
   */
  export function canCreateUpgrader(): boolean {
    let harvesterCount: number = 0;
    let upgraderCount: number = 0;

    _.forEach(creeps, function (creep: Creep, creepName: string) {
      if (creep.memory.role == 'harvester') {
        harvesterCount++;
      }
      if (creep.memory.role == 'upgrader') {
        upgraderCount++;
      }
    });

    if ((Config.MAX_UPGRADERS_PER_CONTROLLER >= upgraderCount) && (harvesterCount > 0)) {
      // We still have enough room for the current controller.
      // We also already have a harvester.
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
