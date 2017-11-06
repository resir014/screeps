import { TravelToOptions } from 'Traveler'

// ------- extended prototypes ------- //

declare global {
  interface Creep {
    /**
     * Move around the map utilising utilising @bonzaiferroni's amazing Traveler library.
     *
     * @link https://github.com/bonzaiferroni/Traveler/wiki/Traveler-API
     * @param {(RoomPosition | { pos: RoomPosition })} destination The final creep destination.
     * @param {TravelToOptions} [options] Options used by the Traveler module.
     * @returns {number} A status code.
     * @memberof Creep
     */
    travelTo(destination: RoomPosition | { pos: RoomPosition }, options?: TravelToOptions): number
  }

  interface StructureSpawn {
    /**
     * Gets the largest buildable body parts from a certain set of available body parts.
     *
     * @param {BodyPartConstant[][]} potentialBodies A list of potential body parts for the spawned creep.
     * @returns {BodyPartConstant[]} the largest buildable body part.
     * @memberof StructureSpawn
     */
    getLargestBuildableBodyFromSet(potentialBodies: BodyPartConstant[][]): BodyPartConstant[]
    /**
     * Gets the largest buildable body parts for a certain body part template.
     *
     * @param {BodyPartConstant[]} bodyTemplate The target body template.
     * @param {number} [maxIterations] Maximum iterations.
     * @returns {BodyPartConstant[]} the largest buildable body part.
     * @memberof StructureSpawn
     */
    getLargestBuildableBodyFromTemplate(bodyTemplate: BodyPartConstant[], maxIterations?: number): BodyPartConstant[]
    /**
     * Gets the optimal amount of `MOVE` parts for a certain body part.
     *
     * @param {BodyPartConstant[]} body The body parts to be calulated (without `MOVE` parts).
     * @param {('road' | 'plain' | 'swamp')} [terrain] The target terrain type for a creep.
     * @param {boolean} [fullCarry] set to `true` if the spawned creep is carrying the max amount of items.
     * @returns {number} the optimal count of `MOVE` parts.
     * @memberof StructureSpawn
     */
    findOptimalMoveCountForBody(body: BodyPartConstant[], terrain?: 'road' | 'plain' | 'swamp', fullCarry?: boolean): number
  }

}
