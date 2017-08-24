import * as Config from '../../config/config'
import { log } from '../../utils/logger'
import * as Inscribe from '../../lib/Inscribe'
import { bodyTemplates } from '../../config/jobs'

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

  public getBodyParts(role: string, spawn: Spawn): string[] {
    // So here we have an API call to build the required bodyparts for our
    // creep. This utilizes tinnvec's super-useful spawn prototype extensions,
    // where you can generate the largest bodypart a room can build based on a
    // build template.
    //
    // The bodypart templates included should be proportional enough based on
    // the passed role. For example:
    //
    // * Harvesters should have 50% WORK parts and 50% MOVE parts.
    // * Builders should have 50% MOVE parts, 25% CARRY parts, and 25% WORK
    //   parts.
    // * Haulers should have 50% CARRY parts and 50% MOVE parts.
    //
    // If you dont like these proportions, free to modify the templates based
    // on your needs at `config/jobs.ts`.

    let bodyParts: string[] = []

    switch (role) {
      case 'hauler':
        bodyParts = spawn.getLargestBuildableBodyFromTemplate(bodyTemplates.haulers)
        break
      case 'harvester':
        bodyParts = spawn.getLargestBuildableBodyFromTemplate(bodyTemplates.harvesters)
        break
      default:
        bodyParts = spawn.getLargestBuildableBodyFromTemplate(bodyTemplates.workers)
        break
    }

    if (Config.ENABLE_DEBUG_MODE) {
      const out = [
        `[${Inscribe.color('Orchestrator', 'skyblue')}]`,
        `[${Inscribe.color('getBodyParts', 'skyblue')}]`,
        `Got bodyparts: ${bodyParts.join(', ')}`
      ]
      log.debug(out.join(' '))
    }

    return bodyParts
  }

  public gclToControlPoints(gcl: number): number {
    return Math.pow(gcl - 1, GCL_POW) * GCL_MULTIPLY
  }

  public controlPointsToGcl(points: number): number {
    return Math.floor(Math.pow(points / GCL_MULTIPLY, 1 / GCL_POW) + 1)
  }
}
