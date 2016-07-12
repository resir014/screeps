import { Config } from './../../config/config';
import { MemoryManager } from './../../shared/memoryManager';
import { JobManager } from './../jobs/jobManager';
import { SourceManager } from './../sources/sourceManager';
import { SpawnManager } from './../spawns/spawnManager';
import { StructureManager } from './../structures/structureManager';
import { ConstructionSiteManager } from './../constructionSites/constructionSiteManager';
import { ControllerManager } from './../controllers/controllerManager';
import { Harvester } from './harvester';
import { Upgrader } from './upgrader';
import { Builder } from './builder';
import { Repairer } from './repairer';
import { WallRepairer } from './wallRepairer';

export namespace CreepManager {

  export let creeps: Creep[];
  export let creepNames: string[] = [];
  export let creepCount: number = 0;

  export let harvesters: Creep[] = [];
  export let upgraders: Creep[] = [];
  export let builders: Creep[] = [];
  export let repairers: Creep[] = [];
  export let wallRepairers: Creep[] = [];

  /**
   * Run creeps that exist in a room.
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
    _loadCreepRoleCounts();

    // TODO i put this here. this looks like a good place for this. - shawn
    _.each(creeps, (creep: Creep) => MemoryManager.updateCreepMemory(creep));

    if (Config.VERBOSE) {
      console.log('[CreepManager] ' + creepCount + ' creeps found in the playground.');
    }
  }

  /**
   * Creates a new creep if we still have enough space.
   * TODO: add some load balancing, have the limit gradually increase as resources increase.
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
    let properties: { [key: string]: any} = null;

    // TODO: make this more non-repeating to maintain DRY-ness
    if (harvesters.length < JobManager.harvesterJobs) {
      let dropoff_id: string = StructureManager.getDropOffPoint() ?
        StructureManager.getDropOffPoint().id :
        SpawnManager.getFirstSpawn().id;

      if (harvesters.length < 2 || room.energyCapacityAvailable <= 300) {
        bodyParts = [MOVE, MOVE, CARRY, WORK];
      } else if (room.energyCapacityAvailable > 300 && room.energyCapacityAvailable <= 700) {
        bodyParts = [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK];
      } else if (room.energyCapacityAvailable > 700 && room.energyCapacityAvailable <= 1200) {
        bodyParts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK, WORK];
      }

      properties = {
        role: 'harvester',
        target_source_id: SourceManager.sources[0].id,
        target_energy_dropoff_id: dropoff_id,
        renew_station_id: SpawnManager.getFirstSpawn().id
      }

      _.forEach(SpawnManager.spawns, (spawn: Spawn) => {
        SpawnManager.spawnCreep(spawn, bodyParts, properties);
      });
    } else if (upgraders.length < JobManager.upgraderJobs) {
      let energyStation_id: string = SpawnManager.getFirstSpawn() ?
        SpawnManager.getFirstSpawn().id : null;

      if (upgraders.length < 2 || room.energyCapacityAvailable <= 300) {
        bodyParts = [MOVE, MOVE, CARRY, WORK];
      } else if (room.energyCapacityAvailable > 300 && room.energyCapacityAvailable <= 700) {
        bodyParts = [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK];
      } else if (room.energyCapacityAvailable > 700 && room.energyCapacityAvailable <= 1200) {
        bodyParts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK, WORK];
      }

      properties = {
        role: 'upgrader',
        target_controller_id: ControllerManager.controller.id,
        target_source_id: SourceManager.sources[0].id,
        target_energy_station_id: energyStation_id,
        renew_station_id: SpawnManager.getFirstSpawn().id,
        upgrading: false
      };

      _.forEach(SpawnManager.spawns, (spawn: Spawn) => {
        SpawnManager.spawnCreep(spawn, bodyParts, properties);
      });
    } else if (builders.length < JobManager.builderJobs) {
      let targetSource_id: string = SourceManager.sourceCount > 1 ?
        SourceManager.sources[1].id : null;
      let energyStation_id: string = SpawnManager.getFirstSpawn() ?
        SpawnManager.getFirstSpawn().id : null;
      let constructionSite_id: string = ConstructionSiteManager.getConstructionSite() ?
        ConstructionSiteManager.getConstructionSite().id : null;

      if (room.energyCapacityAvailable <= 300) {
        bodyParts = [MOVE, MOVE, CARRY, WORK];
      } else if (room.energyCapacityAvailable > 300 && room.energyCapacityAvailable <= 700) {
        bodyParts = [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK];
      } else if (room.energyCapacityAvailable > 700 && room.energyCapacityAvailable <= 1200) {
        bodyParts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK, WORK];
      }

      properties = {
        role: 'builder',
        target_construction_site_id: constructionSite_id,
        target_source_id: targetSource_id,
        target_energy_station_id: energyStation_id,
        renew_station_id: SpawnManager.getFirstSpawn().id,
        building: false
      };

      _.forEach(SpawnManager.spawns, (spawn: Spawn) => {
        SpawnManager.spawnCreep(spawn, bodyParts, properties);
      });
    } else if (repairers.length < JobManager.repairerJobs) {
      let targetSource_id: string = SourceManager.sourceCount > 1 ?
        SourceManager.sources[1].id : null;
      let energyStation_id: string = SpawnManager.getFirstSpawn() ?
        SpawnManager.getFirstSpawn().id : null;
      let toRepair_id: string = StructureManager.getStructuresToRepair() ?
        StructureManager.getStructuresToRepair().id : null;

      if (room.energyCapacityAvailable <= 300) {
        bodyParts = [MOVE, MOVE, CARRY, WORK];
      } else if (room.energyCapacityAvailable > 300 && room.energyCapacityAvailable <= 700) {
        bodyParts = [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK];
      } else if (room.energyCapacityAvailable > 700 && room.energyCapacityAvailable <= 1200) {
        bodyParts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK, WORK];
      }

      properties = {
        role: 'repairer',
        target_repair_site_id: toRepair_id,
        target_source_id: targetSource_id,
        target_energy_station_id: energyStation_id,
        renew_station_id: SpawnManager.getFirstSpawn().id,
        repairing: false
      }

      _.forEach(SpawnManager.spawns, (spawn: Spawn) => {
        SpawnManager.spawnCreep(spawn, bodyParts, properties);
      });
    } else if (wallRepairers.length < JobManager.wallRepairerJobs) {
      let targetSource_id: string = SourceManager.sourceCount > 1 ?
        SourceManager.sources[1].id : null;
      let energyStation_id: string = SpawnManager.getFirstSpawn() ?
        SpawnManager.getFirstSpawn().id : null;
      let toRepair_id: string = StructureManager.getDefensiveStructuresToRepair() ?
        StructureManager.getDefensiveStructuresToRepair().id : null;

      if (room.energyCapacityAvailable <= 300) {
        bodyParts = [MOVE, MOVE, CARRY, WORK];
      } else if (room.energyCapacityAvailable > 300 && room.energyCapacityAvailable <= 700) {
        bodyParts = [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK];
      } else if (room.energyCapacityAvailable > 700 && room.energyCapacityAvailable <= 1200) {
        bodyParts = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK, WORK];
      }

      properties = {
        role: 'wallRepairer',
        target_repair_site_id: toRepair_id,
        target_source_id: targetSource_id,
        target_energy_station_id: energyStation_id,
        renew_station_id: SpawnManager.getFirstSpawn().id,
        repairing: false
      }

      _.forEach(SpawnManager.spawns, (spawn: Spawn) => {
        SpawnManager.spawnCreep(spawn, bodyParts, properties);
      });
    }
  }

  /**
   * Runs all Creep tasks.
   *
   * @param {Room} room
   */
  function _creepsGoToWork(room: Room): void {

    let harvesters: Harvester[] = [];
    let upgraders: Upgrader[] = [];
    let builders: Builder[] = [];
    let repairers: Repairer[] = [];
    let wallRepairers: WallRepairer[] = [];

    _.forEach(creeps, (creep: Creep, creepName: string) => {
      if (creep.memory.role == 'harvester') {
        let harvester = new Harvester();
        harvester.setCreep(creep);
        harvester.action();

        harvesters.push(harvester);
      }
      if (creep.memory.role == 'upgrader') {
        let upgrader = new Upgrader();
        upgrader.setCreep(creep);
        upgrader.action();

        upgraders.push(upgrader);
      }
      if (creep.memory.role == 'builder') {
        let builder = new Builder();
        builder.setCreep(creep);
        builder.action();

        builders.push(builder);
      }
      if (creep.memory.role == 'repairer') {
        let repairer = new Repairer();
        repairer.setCreep(creep);
        repairer.action();

        repairers.push(repairer);
      }
      if (creep.memory.role == 'wallRepairer') {
        let wallRepairer = new WallRepairer();
        wallRepairer.setCreep(creep);
        wallRepairer.action();

        wallRepairers.push(wallRepairer);
      }
    });

    if (Config.VERBOSE) {
      console.log('[CreepManager] ' + harvesters.length + ' harvesters reported on duty today!');
      console.log('[CreepManager] ' + upgraders.length + ' upgraders reported on duty today!');
      console.log('[CreepManager] ' + builders.length + ' builders reported on duty today!');
      console.log('[CreepManager] ' + repairers.length + ' repairers reported on duty today!');
      console.log('[CreepManager] ' + wallRepairers.length + ' wall repairers reported on duty today!');
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

  function _loadCreepRoleCounts(): void {
    // TODO: find a way to avoid API calls.
    harvesters = _.filter(creeps, (creep) => creep.memory.role == 'harvester');
    upgraders = _.filter(creeps, (creep) => creep.memory.role == 'upgrader');
    builders = _.filter(creeps, (creep) => creep.memory.role == 'builder');
    repairers = _.filter(creeps, (creep) => creep.memory.role == 'repairer');
    wallRepairers = _.filter(creeps, (creep) => creep.memory.role == 'wallRepairer');
  }

}
