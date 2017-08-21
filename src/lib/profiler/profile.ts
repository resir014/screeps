import * as profiler from "screeps-profiler";

/**
 * Profile an object function
 * @example
 *    class Foo {
 *      ...
 *      @Profile()
 *      public bar() { ...}
 * @returns class method decorator factory
 * @constructor
 */
export function Profile(): any {
  return function (target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.value;
    descriptor.value = profiler.registerFN(originalMethod);
    return descriptor;
  };
}

/**
 * Profile a class
 * @example
 *     @ProfileClass("Foo")
 *     class Foo {...}
 * @param label name of the class
 * @returns clas decorator factory
 * @constructor
 */
export function ProfileClass(label: string) {
  return function (target: Function) {
    profiler.registerClass(target, label);
  };
}
