// TODO: some of these can be refactored towards StructureManager. -r
export namespace SourceHauler {

  let targetSource: Resource;
  let targetContainers: Structure[] | Container[];
  let targetContainer: Structure | Container;
  let targetTowers: Tower[];
  let targetSpawn: Spawn;
  let targetExtensions: Extension[];
  let targetStorages: Storage[];

  export function run(creep: Creep, room: Room): void {
    if (typeof creep.memory['delivering'] == 'undefined') {
      creep.memory['delivering'] = false;
    }

    if (_.sum(creep.carry) == 0) {
      creep.memory['delivering'] = false;
    }

    if (_.sum(creep.carry) < creep.carryCapacity && creep.memory['delivering'] == false) {
      targetSource = creep.pos.findClosestByPath<Resource>(FIND_DROPPED_RESOURCES);

      if (targetSource != null) {
        if (creep.pos.isNearTo(targetSource)) {
          creep.pickup(targetSource);
        } else {
          creep.moveTo(targetSource);
        }
      } else {
        targetContainers = creep.room.find<Container>(FIND_STRUCTURES, {
          filter: (structure: Structure) => {
            if (structure.structureType == STRUCTURE_CONTAINER) {
              let container = <Container>structure;
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
          })
        } else {
          targetContainer = creep.pos.findClosestByPath<Container>(FIND_STRUCTURES, {
            filter: (structure: Container) => {
              return structure.structureType == STRUCTURE_CONTAINER
            }
          });
          creep.moveTo(targetContainer);
        }
      }
    } else {
      creep.memory['delivering'] = true;
      targetTowers = creep.room.find<Tower>(FIND_STRUCTURES, {
        filter: (structure: Structure) => {
          if (structure.structureType == STRUCTURE_TOWER) {
            let tower: Tower = <Tower>structure;
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
            filter: (structure) => {
              if (structure.structureType == STRUCTURE_EXTENSION) {
                let extension = <Extension>structure;
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
              filter: (structure) => {
                if (structure.structureType == STRUCTURE_STORAGE) {
                  let storage = <Storage>structure;
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

}
