/**
 * Orchestrator is the brain of each Colony. It provides several useful APIs to
 * perform global managerial tasks within a Colony, including managing memory,
 * job assignment, job priorities, mining/construction positions, etc.
 *
 * @export
 * @class Orchestrator
 * @implements {IOrchestrator}
 */
export class Orchestrator implements IOrchestrator {
  public getGuid(): number {
    if (!Memory.guid || Memory.guid > 10000) {
      Memory.guid = 0
    }

    return Memory.guid
  }

  public gclToControlPoints(gcl: number): number {
    return Math.pow(gcl - 1, GCL_POW) * GCL_MULTIPLY
  }

  public controlPointsToGcl(points: number): number {
    return Math.floor(Math.pow(points / GCL_MULTIPLY, 1 / GCL_POW) + 1)
  }
}
