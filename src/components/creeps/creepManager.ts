import { Config } from './../../config/config';
import { MemoryManager } from './../../shared/memoryManager';
import { JobManager } from './../jobs/jobManager';
import { SourceManager } from './../sources/sourceManager';
import { SpawnManager } from './../spawns/spawnManager';
import { StructureManager } from './../structures/structureManager';
import { ConstructionSiteManager } from './../constructionSites/constructionSiteManager';
import { ControllerManager } from './../controllers/controllerManager';
import { Harvester } from './roles/harvester';
import { SourceMiner } from './roles/sourceMiner';
import { SourceHauler } from './roles/sourceHauler';
import { Upgrader } from './roles/upgrader';
import { Builder } from './roles/builder';
import { Repairer } from './roles/repairer';
import { WallRepairer } from './roles/wallRepairer';

export namespace CreepManager {

  export let creeps: Creep[];
  export let creepNames: string[] = [];
  export let creepCount: number = 0;

  export let sourceMiners: Creep[] = [];
  export let sourceHaulers: Creep[] = [];
  export let upgraders: Creep[] = [];
  export let builders: Creep[] = [];
  export let repairers: Creep[] = [];
  export let wallRepairers: Creep[] = [];

  /**
   * Initialization scripts for CreepManager namespace.
   *
   * @export
   * @param {Room} room
   */
  export function run(room: Room): void {
    _loadCreeps(room);
    _buildMissingCreeps(room);
    _creepsGoToWork(room);
  }

  /**
   * Loads and counts all available creeps.
   */
  function _loadCreeps(room: Room): void {
    creeps = room.find<Creep>(FIND_MY_CREEPS);
    creepCount = _.size(creeps);

    _loadCreepNames();
    _loadCreepRoles();

    // TODO i put this here. this looks like a good place for this. - shawn
    _.each(creeps, (creep: Creep) => MemoryManager.updateCreepMemory(creep));

    if (Config.VERBOSE) {
      console.log('[CreepManager] ' + creepCount + ' creeps found in the playground.');
    }
  }

  /**
   * Creates a new creep if we still have enough space.
   * TODO: add some load balancing, have the limit gradually increase as
   * resources increase.
   *
   * @param {Room} room
   */
  function _buildMissingCreeps(room: Room): void {
    // status code
    let status: number | string;

    // base bodyparts for a creep
    let bodyParts: string[];

    // default name (can be null)
    let name: string = null;

    // default creep properties
    let properties: { [key: string]: any } = null;

    if (room.energyCapacityAvailable <= 800) {
      bodyParts = [WORK, WORK, CARRY, MOVE];
    } else if (room.energyCapacityAvailable > 800 && room.energyCapacityAvailable <= 1200) {
      bodyParts = [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
    }

    // TODO: make this more non-repeating to maintain DRY-ness
    if (sourceMiners.length < JobManager.sourceMiningJobs) {
      // In case we ran out of creeps.
      if (sourceMiners.length < 1) bodyParts = [WORK, WORK, CARRY, MOVE];

      _.forEach(SpawnManager.spawns, (spawn: Spawn) => {
        SpawnManager.spawnCreep(spawn, bodyParts, { role: 'sourceMiner' });
      });
    } else if (sourceHaulers.length < JobManager.haulerJobs) {
      // In case we ran out of creeps.
      if (sourceHaulers.length < 1) bodyParts = [WORK, WORK, CARRY, MOVE];

      _.forEach(SpawnManager.spawns, (spawn: Spawn) => {
        SpawnManager.spawnCreep(spawn, bodyParts, { role: 'sourceHauler' });
      });
    } else if (upgraders.length < JobManager.upgraderJobs) {
      // In case we ran out of creeps.
      if (upgraders.length < 1) bodyParts = [WORK, WORK, CARRY, MOVE];

      _.forEach(SpawnManager.spawns, (spawn: Spawn) => {
        SpawnManager.spawnCreep(spawn, bodyParts, { role: 'upgrader' });
      });
    } else if (builders.length < JobManager.builderJobs) {
      _.forEach(SpawnManager.spawns, (spawn: Spawn) => {
        SpawnManager.spawnCreep(spawn, bodyParts, { role: 'builder' });
      });
    } else if (repairers.length < JobManager.repairerJobs) {
      // In case we ran out of creeps.
      if (repairers.length < 1) bodyParts = [WORK, WORK, CARRY, MOVE];

      _.forEach(SpawnManager.spawns, (spawn: Spawn) => {
        SpawnManager.spawnCreep(spawn, bodyParts, { role: 'repairer' });
      });
    } else if (wallRepairers.length < JobManager.wallRepairerJobs) {
      // In case we ran out of creeps.
      if (repairers.length < 1) bodyParts = [WORK, WORK, CARRY, MOVE];

      _.forEach(SpawnManager.spawns, (spawn: Spawn) => {
        SpawnManager.spawnCreep(spawn, bodyParts, { role: 'wallRepairer' });
      });
    }
  }

  /**
   * Runs all Creep tasks.
   *
   * @param {Room} room
   */
  function _creepsGoToWork(room: Room): void {

    let sourceMiners: Creep[] = [];
    let sourceHaulers: Creep[] = [];
    let upgraders: Creep[] = [];
    let builders: Creep[] = [];
    let repairers: Creep[] = [];
    let wallRepairers: Creep[] = [];

    _.forEach(creeps, (creep: Creep, creepName: string) => {
      if (creep.memory.role == 'sourceMiner') {
        SourceMiner.run(creep, room);
        sourceMiners.push(creep);
      }
      if (creep.memory.role == 'sourceHauler') {
        SourceHauler.run(creep, room);
        sourceHaulers.push(creep);
      }
      if (creep.memory.role == 'upgrader') {
        Upgrader.run(creep, room);
        upgraders.push(creep);
      }
      if (creep.memory.role == 'builder') {
        Builder.run(creep, room);
        builders.push(creep);
      }
      if (creep.memory.role == 'repairer') {
        Repairer.run(creep, room);
        repairers.push(creep);
      }
      if (creep.memory.role == 'wallRepairer') {
        WallRepairer.run(creep, room);
        wallRepairers.push(creep);
      }
    });

    if (Config.VERBOSE) {
      console.log('[CreepManager] ' + sourceMiners.length + ' miners reported on duty today!');
      console.log('[CreepManager] ' + sourceHaulers.length + ' haulers reported on duty today!');
      console.log('[CreepManager] ' + upgraders.length + ' upgraders reported on duty today!');
      console.log('[CreepManager] ' + builders.length + ' builders reported on duty today!');
      console.log('[CreepManager] ' + repairers.length + ' repairers reported on duty today!');
      console.log('[CreepManager] ' + wallRepairers.length + ' wall repairers reported on duty today!');
    }

  }

  /**
   * Loads all Creep names and pushes them into an array.
   */
  function _loadCreepNames(): void {
    for (let creepName in creeps) {
      if (creeps.hasOwnProperty(creepName)) {
        creepNames.push(creepName);
      }
    }
  }

  /**
   * Iterates through each creep and pushes them into an array with the
   * corresponding roles.
   */
  function _loadCreepRoles(): void {
    // TODO: find a way to avoid API calls.
    sourceMiners = _.filter(creeps, (creep) => creep.memory.role == 'sourceMiner');
    sourceHaulers = _.filter(creeps, (creep) => creep.memory.role == 'sourceHauler');
    upgraders = _.filter(creeps, (creep) => creep.memory.role == 'upgrader');
    builders = _.filter(creeps, (creep) => creep.memory.role == 'builder');
    repairers = _.filter(creeps, (creep) => creep.memory.role == 'repairer');
    wallRepairers = _.filter(creeps, (creep) => creep.memory.role == 'wallRepairer');
  }

}
