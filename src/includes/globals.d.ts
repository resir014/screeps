declare interface KernelOpts {
  //
}

declare interface StonehengeOpts {
  //
}

declare namespace NodeJS {
  interface Global {
    kernel: StonehengeKernel
    opts: StonehengeOpts
    hardReset: () => void
  }
}

// Extended Screeps globals

interface Memory {
  pidCounter: number
  kernel: KernelMemory
  stats: any
}
