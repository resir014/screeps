// Here we define all the POSIS-compatible APIs that we use:
// https://github.com/screepers/POSIS

declare interface StonehengeBundle<M> {
  install(registry: StonehengeProcessRegistry): void
  rootImageName?: string
  makeDefaultRootMemory?: (override?: M) => M
}

declare interface StonehengeExtension {}
