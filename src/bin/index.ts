import { bundle as InitBundle } from './Init'

export const bundle: StonehengeBundle<{}> = {
  install (registry: StonehengeProcessRegistry) {
    InitBundle.install(registry)
  }
}
