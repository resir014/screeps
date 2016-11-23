import { CreepAction } from "../creepAction";

/**
 * Retrieves any dropped energy and transports them back to any storage
 * locations.
 *
 * @export
 * @class SourceHauler
 * @extends {CreepAction}
 */
export class SourceHauler extends CreepAction {
  private room: Room;

  /**
   * Creates an instance of SourceHauler.
   *
   * @param {Creep} creep The current creep.
   * @param {Room} room The current room.
   */
  constructor(creep: Creep, room: Room) {
    super(creep);
    this.room = room;
  }

  /**
   * Run all SourceHauler actions.
   */
  public run(): void {
    if (typeof this.creep.memory.delivering === "undefined") {
      this.creep.memory.delivering = false;
    }

    if (_.sum(this.creep.carry) === 0) {
      this.creep.memory.delivering = false;
    }

    if (_.sum(this.creep.carry) < this.creep.carryCapacity && !this.creep.memory.delivering) {
      let targetSource = this.creep.pos.findClosestByPath<Resource>(FIND_DROPPED_RESOURCES);

      if (targetSource) {
        if (this.creep.pos.isNearTo(targetSource)) {
          this.creep.pickup(targetSource);
        } else {
          this.moveTo(targetSource);
        }
      } else {
        let targetContainers = this.creep.room.find<Container>(FIND_STRUCTURES, {
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
            if (this.creep.pos.isNearTo(container)) {
              container.transfer(this.creep, RESOURCE_ENERGY);
            } else {
              this.moveTo(container);
            }
          });
        } else {
          let targetContainer = this.creep.pos.findClosestByPath<Container>(FIND_STRUCTURES, {
            filter: (structure: Container) => {
              return structure.structureType === STRUCTURE_CONTAINER;
            }
          });
          this.moveTo(targetContainer);
        }
      }
    } else {
      this.creep.memory.delivering = true;
      let targetTowers = this.creep.room.find<Tower>(FIND_STRUCTURES, {
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
          if (this.creep.pos.isNearTo(tower)) {
            this.creep.transfer(tower, RESOURCE_ENERGY);
          } else {
            this.moveTo(tower);
          }
        });
      } else {
        let targetSpawn = this.creep.pos.findClosestByRange<Spawn>(FIND_MY_SPAWNS);
        if (targetSpawn.energy < targetSpawn.energyCapacity) {
          if (this.creep.pos.isNearTo(targetSpawn)) {
            this.creep.transfer(targetSpawn, RESOURCE_ENERGY);
          } else {
            this.moveTo(targetSpawn);
          }
        } else {
          let targetExtensions = this.creep.room.find<Extension>(FIND_STRUCTURES, {
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
              if (this.creep.pos.isNearTo(extension)) {
                this.creep.transfer(extension, RESOURCE_ENERGY);
              } else {
                this.moveTo(extension);
              }
            });
          } else {
            let targetStorages = this.creep.room.find<Storage>(FIND_STRUCTURES, {
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
                if (this.creep.pos.isNearTo(storage)) {
                  this.creep.transfer(storage, RESOURCE_ENERGY);
                } else {
                  this.moveTo(storage);
                }
              });
            }
          }
        }
      }
    }
  }

}
