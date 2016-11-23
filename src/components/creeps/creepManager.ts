import * as Config from "../../config/config";

import * as sourceMiner from "./roles/sourceMiner";
import * as sourceHauler from "./roles/sourceHauler";

import { log } from "../../utils/log";

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
 * Initialization scripts for CreepManager module.
 *
 * @export
 * @param {Room} room
 */
export function run(room: Room): void {
  _loadCreeps(room);
  _buildMissingCreeps(room);

  _.each(creeps, (creep: Creep) => {
    if (creep.memory.role === "sourceMiner") {
      sourceMiner.run(creep);
    }
    if (creep.memory.role === "sourceHauler") {
      sourceHauler.run(creep);
    }
  });
}

/**
 * Loads and counts all available creeps.
 *
 * @param {Room} room
 */
function _loadCreeps(room: Room) {
  creeps = room.find<Creep>(FIND_MY_CREEPS);
  creepCount = _.size(creeps);

  // Iterate through each creep and push them into the role array.
  sourceMiners = _.filter(creeps, (creep) => creep.memory.role === "sourceMiner");
  sourceHaulers = _.filter(creeps, (creep) => creep.memory.role === "sourceHauler");
  upgraders = _.filter(creeps, (creep) => creep.memory.role === "upgrader");
  builders = _.filter(creeps, (creep) => creep.memory.role === "builder");
  repairers = _.filter(creeps, (creep) => creep.memory.role === "repairer");
  wallRepairers = _.filter(creeps, (creep) => creep.memory.role === "wallRepairer");

  if (Config.ENABLE_DEBUG_MODE) {
    log.info(creepCount + " creeps found in the playground.");
  }
}

/**
 * Creates a new creep if we still have enough space.
 *
 * @param {Room} room
 */
function _buildMissingCreeps(room: Room) {
  let bodyParts: string[] = [];

  let spawns: Spawn[] = room.find<Spawn>(FIND_MY_SPAWNS, {
    filter: (spawn: Spawn) => {
      return spawn.spawning === null;
    },
  });

  if (room.energyCapacityAvailable <= 800) {
    bodyParts = [WORK, WORK, CARRY, MOVE];
  } else if (room.energyCapacityAvailable > 800 && room.energyCapacityAvailable <= 1200) {
    bodyParts = [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
  }

  for (let spawn of spawns) {
    if (Config.ENABLE_DEBUG_MODE) {
      log.debug("Spawning from:", spawn.name);
    }

    if (spawn.canCreateCreep) {
      if (sourceMiners.length >= 1) {
        if (sourceHaulers.length < Memory.rooms[room.name].jobs.haulerJobs) {
          bodyParts = [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE];
          _spawnCreep(spawn, bodyParts, "sourceHauler");
          break;
        } else if (sourceMiners.length < Memory.rooms[room.name].jobs.sourceMiningJobs) {
          if (sourceMiners.length < 1 || room.energyCapacityAvailable <= 800) {
            bodyParts = [WORK, WORK, MOVE];
          } else if (room.energyCapacityAvailable > 800) {
            bodyParts = [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE];
          }
          _spawnCreep(spawn, bodyParts, "sourceMiner");
        } else if (upgraders.length < Memory.rooms[room.name].jobs.upgraderJobs) {
          // In case we ran out of creeps.
          if (upgraders.length < 1) {
            bodyParts = [WORK, WORK, CARRY, MOVE];
          }
          _spawnCreep(spawn, bodyParts, "upgrader");
        } else if (builders.length < Memory.rooms[room.name].jobs.builderJobs) {
          // In case we ran out of creeps.
          if (builders.length < 1) {
            bodyParts = [WORK, WORK, CARRY, MOVE];
          }
          _spawnCreep(spawn, bodyParts, "builder");
        } else if (repairers.length < Memory.rooms[room.name].jobs.repairJobs) {
          // In case we ran out of creeps.
          if (repairers.length < 1) {
            bodyParts = [WORK, WORK, CARRY, MOVE];
          }
          _spawnCreep(spawn, bodyParts, "repairer");
        } else if (wallRepairers.length < Memory.rooms[room.name].jobs.wallRepairJobs) {
          // In case we ran out of creeps.
          if (repairers.length < 1) {
            bodyParts = [WORK, WORK, CARRY, MOVE];
          }
          _spawnCreep(spawn, bodyParts, "wallRepairer");
        }
      } else {
        if (sourceMiners.length < Memory.rooms[room.name].jobs.sourceMiningJobs) {
          bodyParts = [WORK, WORK, MOVE];
          _spawnCreep(spawn, bodyParts, "sourceMiner");
          break;
        }
      }
    }
  }
}

/**
 * Spawns a new creep.
 *
 * @param {Spawn} spawn
 * @param {string[]} bodyParts
 * @param {string} role
 * @returns
 */
function _spawnCreep(spawn: Spawn, bodyParts: string[], role: string) {
  let uuid: number = Memory.uuid;
  let status: number | string = spawn.canCreateCreep(bodyParts, undefined);

  let properties: { [key: string]: any } = {
    role,
    room: spawn.room.name,
  };

  status = _.isString(status) ? OK : status;
  if (status === OK) {
    Memory.uuid = uuid + 1;
    let creepName: string = spawn.room.name + " - " + role + uuid;

    log.info("Started creating new creep: " + creepName);
    if (Config.ENABLE_DEBUG_MODE) {
      log.debug("Body: " + bodyParts);
      log.debug("UUID: " + uuid);
    }

    status = spawn.createCreep(bodyParts, creepName, properties);

    return _.isString(status) ? OK : status;
  } else {
    if (Config.ENABLE_DEBUG_MODE) {
      log.error("Failed creating new creep: " + status);
    }

    return status;
  }
}
