// Kernel architecture mainly inspired from:
// https://github.com/screepers/POSIS

declare interface StonehengeLogger {
  debug(message: (() => string) | string): void;
  info(message: (() => string) | string): void;
  warn(message: (() => string) | string): void;
  error(message: (() => string) | string): void;
}
