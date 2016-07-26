// TODO: some of these can be refactored towards StructureManager. -r
export let targetSource: Resource;
export let targetContainers: Structure[] | Container[];
export let targetContainer: Structure | Container;
export let targetTowers: Tower[];
export let targetSpawn: Spawn;
export let targetExtensions: Extension[];
export let targetStorages: Storage[];

/**
 * Run all SourceHauler actions.
 *
 * @export
 * @param {Creep} creep The current creep.
 * @param {Room} room The current room.
 */
export function run(creep: Creep, room: Room): void {
  if (typeof creep.memory["delivering"] === "undefined") {
    creep.memory["delivering"] = false;
  }

  if (_.sum(creep.carry) === 0) {
    creep.memory["delivering"] = false;
  }

  if (_.sum(creep.carry) < creep.carryCapacity && !creep.memory["delivering"]) {
    targetSource = creep.pos.findClosestByPath<Resource>(FIND_DROPPED_RESOURCES);

    if (targetSource) {
      if (creep.pos.isNearTo(targetSource)) {
        creep.pickup(targetSource);
      } else {
        creep.moveTo(targetSource);
      }
    } else {
      targetContainers = creep.room.find<Container>(FIND_STRUCTURES, {
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
            creep.moveTo(container);
          }
        });
      } else {
        targetContainer = creep.pos.findClosestByPath<Container>(FIND_STRUCTURES, {
          filter: (structure: Container) => {
            return structure.structureType === STRUCTURE_CONTAINER;
          }
        });
        creep.moveTo(targetContainer);
      }
    }
  } else {
    creep.memory["delivering"] = true;
    targetTowers = creep.room.find<Tower>(FIND_STRUCTURES, {
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
          creep.moveTo(tower);
        }
      });
    } else {
      targetSpawn = creep.pos.findClosestByRange<Spawn>(FIND_MY_SPAWNS);
      if (targetSpawn.energy < targetSpawn.energyCapacity) {
        if (creep.pos.isNearTo(targetSpawn)) {
          creep.transfer(targetSpawn, RESOURCE_ENERGY);
        } else {
          creep.moveTo(targetSpawn);
        }
      } else {
        targetExtensions = creep.room.find<Extension>(FIND_STRUCTURES, {
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
              creep.moveTo(extension);
            }
          });
        } else {
          targetStorages = creep.room.find<Storage>(FIND_STRUCTURES, {
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
                creep.moveTo(storage);
              }
            });
          }
        }
      }
    }
  }
}
