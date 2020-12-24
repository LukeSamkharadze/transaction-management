import { Decorators } from "./decorators"
import ConstructorCounter = Decorators.ConstructorCounter;
import Secured = Decorators.Secured;

export namespace Scenario {
  export type CallFn = (store: any) => Promise<any>;
  export type RestoreFn = (store: any) => Promise<any>;

  export class Meta {
    constructor(public title: string, public description: string) { }
  }

  @ConstructorCounter("scenarioConstructor")
  export class Scenario {
    @Secured(true, false, false) index: number;
    @Secured(true, false, false) meta: Meta;
    @Secured(true, false, false) call: CallFn;
    @Secured(true, false, false) restore?: RestoreFn;
    @Secured(true, false, false) isCritical?: boolean;

    constructor(index: number, title: string, description: string, call: CallFn, restore?: RestoreFn, isCritical: boolean = true) {
      this.index = index;
      this.meta = new Meta(title, description);
      this.call = call;
      this.restore = restore;
      this.isCritical = isCritical;
    }
  }
}