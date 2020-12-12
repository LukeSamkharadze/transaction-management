import deepCopy from "rfdc";
import { SuccessfulLog, FailedLog, SilentFailedLog, RollbackLog } from "./log.mjs";

class Transaction {
  constructor() {
    this.store = {};
    this.logs = [];
  }

  async DispatchScenarios(scenarios) {
    scenarios.sort((o, oo) => o.index - oo.index);
    for (let [id, scenario] of scenarios.entries())
      try { await this.DispatchScenario(scenario.call, SuccessfulLog, scenario.index, scenario.meta) }
      catch (error) {
        if ("isCritical" in scenario && !scenario.isCritical)
          this.logs.push(new SilentFailedLog(scenario.index, scenario.meta, storeBefore, deepCopy()(this.store), error));
        else {
          this.logs.push(new FailedLog(scenario.index, scenario.meta, error));
          scenarios.slice(0, id).reverse().forEach(async o => "restore" in o && await this.DispatchScenario(o.restore, RollbackLog, o.index, o.meta));
          break;
        }
      }
  }

  async DispatchScenario(method, dispatchType, ...args) {
    let storeBefore = deepCopy()(this.store);
    await method(this.store);
    this.logs.push(new dispatchType(...args.concat([storeBefore, deepCopy()(this.store)])));
  }
}

export { Transaction };