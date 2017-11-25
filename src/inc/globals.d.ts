declare interface KernelOpts {
  //
}

declare interface StonehengeOpts {
  //
}

declare namespace NodeJS {
  interface Global {
    kernel: StonehengeKernel
    os: StonehengeOpts
    hardReset: () => void
  }
}

// Extended Screeps globals

interface Memory {
  pidCounter: number
  kernel: KernelMemory
}
