import { Profile } from '../../../lib/profiler/profile'
import { Role } from '../role'

/**
 * A Hauler retrieves energy harvested by a Harvester and carries them to
 * the nearest spawn, extension, container, storage, or tower.
 *
 * @todo Refactor this.
 */
export class Hauler extends Role {
  /**
   * Creates an instance of Hauler.
   * @param {Creep} creep The current creep.
   *
   * @memberOf Hauler
   */
  constructor(creep: Creep) {
    super(creep)
  }

  /**
   * Run the module.
   */
  @Profile()
  public run(): void {
    if (!this.memory.state) {
      this.memory.state = 'idle'
    }

    if (_.sum(this.creep.carry) === 0) {
      this.memory.state = 'idle'
    }

    if (_.sum(this.creep.carry) < this.creep.carryCapacity && this.memory.state !== 'delivering') {
      const targetSource: Resource = this.creep.pos.findClosestByPath<Resource>(FIND_DROPPED_RESOURCES)

      if (targetSource) {
        if (this.creep.pos.isNearTo(targetSource)) {
          this.creep.pickup(targetSource)
        } else {
          this.moveTo(targetSource, 1)
        }
      } else {
        const targetContainers = this.creep.room.find<Container>(FIND_STRUCTURES, {
          filter: (structure: Structure) => {
            if (structure.structureType === STRUCTURE_CONTAINER) {
              const container: Container = structure as Container
              if (_.sum(container.store) > 200) {
                return container
              }
            }
          }
        })

        if (targetContainers.length > 0) {
          targetContainers.forEach((container: Container) => {
            if (this.creep.pos.isNearTo(container)) {
              container.transfer(this.creep, RESOURCE_ENERGY)
            } else {
              this.moveTo(container, 1)
            }
          })
        } else {
          const targetContainer = this.creep.pos.findClosestByPath<Container>(FIND_STRUCTURES, {
            filter: (structure: Container) => {
              return structure.structureType === STRUCTURE_CONTAINER
            }
          })
          this.moveTo(targetContainer, 1)
        }
      }
    } else {
      this.creep.memory.state = 'delivering'
      const targetTowers = this.creep.room.find<Tower>(FIND_STRUCTURES, {
        filter: (structure: Structure) => {
          if (structure.structureType === STRUCTURE_TOWER) {
            const tower: Tower = structure as Tower
            if (tower.energy < tower.energyCapacity) {
              return tower
            }
          }
        }
      })

      if (targetTowers.length > 0) {
        targetTowers.forEach((tower: Tower) => {
          if (this.creep.pos.isNearTo(tower)) {
            this.creep.transfer(tower, RESOURCE_ENERGY)
          } else {
            this.moveTo(tower, 1)
          }
        })
      } else {
        const targetSpawn = this.creep.pos.findClosestByRange<Spawn>(FIND_MY_SPAWNS)
        if (targetSpawn.energy < targetSpawn.energyCapacity) {
          if (this.creep.pos.isNearTo(targetSpawn)) {
            this.creep.transfer(targetSpawn, RESOURCE_ENERGY)
          } else {
            this.moveTo(targetSpawn, 1)
          }
        } else {
          const targetExtensions = this.creep.room.find<Extension>(FIND_STRUCTURES, {
            filter: (structure: Structure) => {
              if (structure.structureType === STRUCTURE_EXTENSION) {
                const extension = structure as Extension
                if (extension.energy < extension.energyCapacity) {
                  return extension
                }
              }
            }
          })

          if (targetExtensions.length > 0) {
            targetExtensions.forEach((extension: Extension) => {
              if (this.creep.pos.isNearTo(extension)) {
                this.creep.transfer(extension, RESOURCE_ENERGY)
              } else {
                this.moveTo(extension, 1)
              }
            })
          } else {
            const targetStorages = this.creep.room.find<Storage>(FIND_STRUCTURES, {
              filter: (structure: Structure) => {
                if (structure.structureType === STRUCTURE_STORAGE) {
                  const storage = structure as Storage
                  if (_.sum(storage.store) < storage.storeCapacity) {
                    return storage
                  }
                }
              }
            })

            if (targetStorages.length > 0) {
              targetStorages.forEach((storage: Storage) => {
                if (this.creep.pos.isNearTo(storage)) {
                  this.creep.transfer(storage, RESOURCE_ENERGY)
                } else {
                  this.moveTo(storage, 1)
                }
              })
            }
          }
        }
      }
    }
  }
}
