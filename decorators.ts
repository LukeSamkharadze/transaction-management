import { Validator } from "./validator"
import Validator_ = Validator.Validator;

export namespace Decorators {
  export function Secured(writable: boolean, configurable: boolean, enumerable: boolean) {
    return function (target: any, propertyKey: string): any {
      return {
        writable,
        configurable,
        enumerable
      }
    }
  }

  export function ValidateConstructor(validator: Validator_<any>) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
      return class extends constructor {
        constructor(...args: any[]) {
          super(...args);
          validator.Validate(this);
        }
      }
    }
  }

  export let counter: Map<string, number> = new Map<any, number>();
  export function ConstructorCounter(key: string) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
      return class extends constructor {
        constructor(...args: any[]) {
          super(...args);
          if (counter.get(key) === undefined)
            counter.set(key, 0);
          counter.set(key, counter.get(key)! + 1)
        }
      }
    }
  }
}