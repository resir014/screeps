interface InscribeOptions {
  level?: number
}

interface InscribeMemory {
  level: number
}

interface Inscribe {
  write(message: string, options?: InscribeOptions): void
}
