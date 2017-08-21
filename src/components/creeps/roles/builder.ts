import * as Config from '../../../config/config'
import { log } from '../../../lib/logger'
import { Profile } from '../../../lib/profiler/profile'
import { Role } from '../role'

/**
 * A Builder builds construction sites.
 *
 * When given a list of structures to build, it will always builds by its order
 * in the array, so it might be wise to pass a pre-sorted array of construction
 * sites to build.
 */
export class Builder extends Role {
  private constructionSites: ConstructionSite[]
  private constructionSiteCount: number

  private roads: ConstructionSite[] = []
  private extensions: ConstructionSite[] = []
  private containers: ConstructionSite[] = []
  private walls: ConstructionSite[] = []
  private ramparts: ConstructionSite[] = []
  private towers: ConstructionSite[] = []
  private storages: ConstructionSite[] = []

  /**
   * Creates an instance of Builder.
   * @param {Creep} creep The current creep.
   *
   * @memberOf Builder
   */
  constructor(creep: Creep) {
    super(creep)
    this.constructionSites = creep.room.find<ConstructionSite>(FIND_CONSTRUCTION_SITES)
    this.constructionSiteCount = _.size(this.constructionSites)
    this.getConstructionSites()

    if (Config.ENABLE_DEBUG_MODE) {
      log.debug('[Builder]', this.constructionSiteCount + ' construction sites in room' +
        creep.room.name + '.')
    }
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

    if (_.sum(this.creep.carry) < this.creep.carryCapacity && this.memory.state !== 'building') {
      this.tryRetrieveEnergy()
    } else {
      this.memory.state = 'building'
      const targetConstructionSite = this.getConstructionSite(this.constructionSites)

      if (targetConstructionSite) {
        if (this.creep.pos.isNearTo(targetConstructionSite)) {
          this.creep.build(targetConstructionSite)
        } else {
          this.moveTo(targetConstructionSite)
        }
      }
    }
  }

  private getConstructionSites(): void {
    this.roads = this.constructionSites.filter((structure: ConstructionSite) => {
      return structure.structureType === STRUCTURE_ROAD
    })

    this.extensions = this.constructionSites.filter((structure: ConstructionSite) => {
      return structure.structureType === STRUCTURE_EXTENSION
    })

    this.containers = this.constructionSites.filter((structure: ConstructionSite) => {
      return structure.structureType === STRUCTURE_CONTAINER
    })

    this.walls = this.constructionSites.filter((structure: ConstructionSite) => {
      return structure.structureType === STRUCTURE_WALL
    })

    this.ramparts = this.constructionSites.filter((structure: ConstructionSite) => {
      return structure.structureType === STRUCTURE_RAMPART
    })

    this.towers = this.constructionSites.filter((structure: ConstructionSite) => {
      return structure.structureType === STRUCTURE_TOWER
    })

    this.storages = this.constructionSites.filter((structure: ConstructionSite) => {
      return structure.structureType === STRUCTURE_STORAGE
    })
  }

  /**
   * Gets a prioritised list of construction sites to maintain.
   * @todo This really needs to be refactored to Orchestrator.
   *
   * @param constructionSites The list of construction sites to sort
   */
  private getConstructionSite(constructionSites: ConstructionSite[]): ConstructionSite {
    let target: ConstructionSite

    if (this.roads.length > 0) {
      target = this.roads[0]
    } else if (this.extensions.length > 0) {
      target = this.extensions[0]
    } else if (this.containers.length > 0) {
      target = this.containers[0]
    } else if (this.walls.length > 0) {
      target = this.walls[0]
    } else if (this.ramparts.length > 0) {
      target = this.ramparts[0]
    } else if (this.towers.length > 0) {
      target = this.towers[0]
    } else if (this.storages.length > 0) {
      target = this.storages[0]
    } else {
      target = constructionSites[0]
    }

    return target
  }
}
