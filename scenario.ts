import { Decorators } from "./decorators"
import ValidateConstructor = Decorators.ValidateConstructor;
import ConstructorCounter = Decorators.ConstructorCounter;
import Secured = Decorators.Secured;

import { Validator } from "./validator"
import ScenarioValidator = Validator.ScenarioValidator;

export namespace Scenario {
  export type CallFn = (store: any) => Promise<any>;
  export type RestoreFn = (store: any) => Promise<any>;

  export class Meta {
    constructor(public title: string, public description: string) { }
  }

  @ConstructorCounter("scenarioConstructor")
  @ValidateConstructor(new ScenarioValidator())
  export class Scenario {
    @Secured(true, false, false) index: number;
    @Secured(true, false, false) meta: Meta;
    @Secured(true, false, false) call: CallFn;
    @Secured(true, false, false) restore?: RestoreFn;
    @Secured(true, false, false) isCritical?: boolean;

    constructor(index: number, meta: Meta, call: CallFn, restore?: RestoreFn, isCritical: boolean = true) {
      this.index = index;
      this.meta = meta;
      this.call = call;
      this.restore = restore;
      this.isCritical = isCritical;
    }
  }
}