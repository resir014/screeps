import { Traveler } from '../lib/Traveler/Traveler'

/**
 * Loads all extended `Creep` prototypes.
 */
export function loadCreepPrototypes(): void {
  Creep.prototype.travelTo = function (
    destination: RoomPosition | { pos: RoomPosition },
    options?: TravelToOptions
  ) {
    return Traveler.travelTo(this, destination, options)
  }
}
