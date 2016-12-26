import * as creepActions from "../creepActions";

/**
 * Runs all creep actions.
 *
 * @export
 * @param {Creep} creep The current creep.
 */
export function run(creep: Creep): void {
  if (typeof creep.memory.delivering === "undefined") {
    creep.memory.delivering = false;
  }

  if (_.sum(creep.carry) === 0) {
    creep.memory.delivering = false;
  }

  if (_.sum(creep.carry) < creep.carryCapacity && !creep.memory.delivering) {
    let targetSource: Resource = creep.pos.findClosestByPath<Resource>(FIND_DROPPED_RESOURCES);

    if (targetSource) {
      if (creep.pos.isNearTo(targetSource)) {
        creep.pickup(targetSource);
      } else {
        creepActions.moveToResource(creep, targetSource);
      }
    } else {
      let targetContainers = creep.room.find<Container>(FIND_STRUCTURES, {
        filter: (structure: Structure) => {
          if (structure.structureType === STRUCTURE_CONTAINER) {
            let container: Container = <Container> structure;
            if (_.sum(container.store) > 200) {
              return container;
            }
          }
        }
      });

      if (targetContainers.length > 0) {
        targetContainers.forEach((container: Container) => {
          if (creep.pos.isNearTo(container)) {
            container.transfer(creep, RESOURCE_ENERGY);
          } else {
            creepActions.moveTo(creep, container);
          }
        });
      } else {
        let targetContainer = creep.pos.findClosestByPath<Container>(FIND_STRUCTURES, {
          filter: (structure: Container) => {
            return structure.structureType === STRUCTURE_CONTAINER;
          }
        });
        creepActions.moveTo(creep, targetContainer);
      }
    }
  } else {
    creep.memory.delivering = true;
    let targetTowers = creep.room.find<Tower>(FIND_STRUCTURES, {
      filter: (structure: Structure) => {
        if (structure.structureType === STRUCTURE_TOWER) {
          let tower: Tower = <Tower> structure;
          if (tower.energy < tower.energyCapacity) {
            return tower;
          }
        }
      }
    });

    if (targetTowers.length > 0) {
      targetTowers.forEach((tower: Tower) => {
        if (creep.pos.isNearTo(tower)) {
          creep.transfer(tower, RESOURCE_ENERGY);
        } else {
          creepActions.moveTo(creep, tower);
        }
      });
    } else {
      let targetSpawn = creep.pos.findClosestByRange<Spawn>(FIND_MY_SPAWNS);
      if (targetSpawn.energy < targetSpawn.energyCapacity) {
        if (creep.pos.isNearTo(targetSpawn)) {
          creep.transfer(targetSpawn, RESOURCE_ENERGY);
        } else {
          creepActions.moveTo(creep, targetSpawn);
        }
      } else {
        let targetExtensions = creep.room.find<Extension>(FIND_STRUCTURES, {
          filter: (structure: Structure) => {
            if (structure.structureType === STRUCTURE_EXTENSION) {
              let extension = <Extension> structure;
              if (extension.energy < extension.energyCapacity) {
                return extension;
              }
            }
          }
        });

        if (targetExtensions.length > 0) {
          targetExtensions.forEach((extension: Extension) => {
            if (creep.pos.isNearTo(extension)) {
              creep.transfer(extension, RESOURCE_ENERGY);
            } else {
              creepActions.moveTo(creep, extension);
            }
          });
        } else {
          let targetStorages = creep.room.find<Storage>(FIND_STRUCTURES, {
            filter: (structure: Structure) => {
              if (structure.structureType === STRUCTURE_STORAGE) {
                let storage = <Storage> structure;
                if (_.sum(storage.store) < storage.storeCapacity) {
                  return storage;
                }
              }
            }
          });

          if (targetStorages.length > 0) {
            targetStorages.forEach((storage: Storage) => {
              if (creep.pos.isNearTo(storage)) {
                creep.transfer(storage, RESOURCE_ENERGY);
              } else {
                creepActions.moveTo(creep, storage);
              }
            });
          }
        }
      }
    }
  }
}
