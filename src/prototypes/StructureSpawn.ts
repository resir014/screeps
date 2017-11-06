// tslint:disable:no-increment-decrement

/**
 * Loads all extended `StructureSpawn` prototypes.
 */
export function loadStructureSpawnPrototypes(): void {
  StructureSpawn.prototype.getLargestBuildableBodyFromSet = function (
    this: StructureSpawn,
    potentialBodies: BodyPartConstant[][]
  ): BodyPartConstant[] {
    let body: BodyPartConstant[] = []
    let bodyCost = Number.MAX_VALUE
    let i: number

    for (i = 0; i < potentialBodies.length; i++) {
      bodyCost = _.sum(potentialBodies[i], (bp: BodyPartConstant) => BODYPART_COST[bp])
      if (bodyCost <= this.room.energyCapacityAvailable) {
        body = potentialBodies[i]
        break
      }
    }

    return body
  }

  StructureSpawn.prototype.getLargestBuildableBodyFromTemplate = function (
    this: StructureSpawn,
    bodyTemplate: BodyPartConstant[],
    maxIterations?: number
  ): BodyPartConstant[] {
    let result: BodyPartConstant[] = []
    let i: number
    const numberOfParts = Math.min(
      Math.floor(this.room.energyCapacityAvailable / _.sum(bodyTemplate, (bp: BodyPartConstant) => BODYPART_COST[bp])),
      Math.floor(50 / bodyTemplate.length),
      maxIterations || 100
    )

    for (i = 0; i < numberOfParts; i++) {
      result = result.concat(bodyTemplate)
    }

    return result
  }

  StructureSpawn.prototype.findOptimalMoveCountForBody = function (
    body: BodyPartConstant[],
    terrain: 'road' | 'plain' | 'swamp' = 'plain',
    fullCarry: boolean = false
  ): number {
    let bodyWeight = 0
    let i: number
    for (i = 0; i < body.length; i++) {
      if (body[i] === CARRY && !fullCarry) { continue }
      bodyWeight++
    }
    const terrainCost: number = terrain === 'swamp' ? 5 : terrain === 'road' ? 0.5 : 1
    return Math.ceil(terrainCost * bodyWeight)
  }
}
