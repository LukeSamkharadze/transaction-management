export namespace Scenario {

  export type CallFn = (store: any) => Promise<any>;
  export type RestoreFn = (store: any) => Promise<any>;

  export class Meta {
    constructor(public title: string, public description: string) { }
  }

  function secured(writable: boolean, configurable: boolean, enumerable: boolean) {
    return function (target: any, propertyKey: string): any {
      return {
        writable,
        configurable,
        enumerable
      }
    }
  }

  export class Scenario {
    @secured(true, false, false) index: number;
    @secured(true, false, false) meta: Meta;
    @secured(true, false, false) call: CallFn;
    @secured(true, false, false) restore?: RestoreFn;
    @secured(true, false, false) isCritical?: boolean;

    constructor(index: number, title: string, description: string, call: CallFn, restore?: RestoreFn, isCritical: boolean = true) {
      this.index = index;
      this.meta = new Meta(title, description);
      this.call = call;
      this.restore = restore;
      this.isCritical = isCritical;
    }
  }
}