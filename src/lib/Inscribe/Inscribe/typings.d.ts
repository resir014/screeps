interface InscribeOptions {
  level?: number
}

interface InscribeMemory {
  level: number
}

interface Inscribe {
  write(message: string, options?: InscribeOptions): void
  color(str: string, color: string): string
  link(href: string, title: string): string
  tooltip(str: string, tooltip: string): string
  time(time: number): string
}
