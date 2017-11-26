import { bundle as InitBundle } from './Init'
import { bundle as RoomOrchestratorBundle } from './orchestrator/RoomOrchestrator'

export const bundle: StonehengeBundle<{}> = {
  install (registry: StonehengeProcessRegistry) {
    InitBundle.install(registry)
    RoomOrchestratorBundle.install(registry)
  }
}
