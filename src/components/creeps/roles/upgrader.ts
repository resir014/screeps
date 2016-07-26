import { CreepAction } from "../creepAction";

/**
 * Collects energy and uses it to upgrade the room's controller.
 *
 * @export
 * @class Upgrader
 * @extends {CreepAction}
 */
export class Upgrader extends CreepAction {
  private room: Room;

  /**
   * Creates an instance of Upgrader.
   *
   * @param {Creep} creep The current creep.
   * @param {Room} room The current room.
   */
  constructor(creep: Creep, room: Room) {
    super(creep);
    this.room = room;
  }

  /**
   * Run all Upgrader actions.
   */
  public run(): void {
    if (typeof this.creep.memory["upgrading"] === "undefined") {
      this.creep.memory["upgrading"] = false;
    }

    if (this.creep.memory["upgrading"] && this.creep.carry.energy === 0) {
      this.creep.memory["upgrading"] = false;
    }

    if (!this.creep.memory["upgrading"] && this.creep.carry.energy === this.creep.carryCapacity) {
      this.creep.memory["upgrading"] = true;
    }

    if (this.creep.memory["upgrading"]) {
      if (this.creep.upgradeController(this.creep.room.controller) === ERR_NOT_IN_RANGE) {
        this.moveTo(this.creep.room.controller);
      }
    } else {
      let targetSource = this.creep.pos.findClosestByPath<Resource>(FIND_DROPPED_RESOURCES);

      if (targetSource) {
        if (this.creep.pos.isNearTo(targetSource)) {
          this.creep.pickup(targetSource);
        } else {
          this.moveTo(targetSource);
        }
      } else {
        let targetSource = this.creep.pos.findClosestByPath<Resource>(FIND_DROPPED_RESOURCES);

        if (targetSource) {
          if (this.creep.pos.isNearTo(targetSource)) {
            this.creep.pickup(targetSource);
          } else {
            this.moveTo(targetSource);
          }
        } else {
          let targetContainer = this.creep.pos.findClosestByPath<Container>(FIND_STRUCTURES, {
            filter: ((structure: Structure) => {
              if (structure.structureType === STRUCTURE_CONTAINER) {
                let container: Container = <Container>structure;
                if (_.sum(container.store) > (500)) {
                  return container;
                }
              }
            })
          });

          if (this.creep.pos.isNearTo(targetContainer)) {
            this.creep.withdraw(targetContainer, RESOURCE_ENERGY);
          } else {
            this.moveTo(targetContainer);
          }
        }
      }
    }
  }
}
