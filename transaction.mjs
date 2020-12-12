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
      try {
        var storeBefore = deepCopy()(this.store);
        await scenario.call(this.store);
        this.logs.push(new SuccessfulLog(scenario.index, scenario.meta, storeBefore, deepCopy()(this.store)));
      }
      catch (error) {
        if ("isCritical" in scenario && !scenario.isCritical)
          this.logs.push(new SilentFailedLog(scenario.index, scenario.meta, storeBefore, deepCopy()(this.store), error));
        else {
          this.logs.push(new FailedLog(scenario.index, scenario.meta, error));
          for (let scenario of scenarios.slice(0, id+1).reverse())
          {
            var storeBefore = deepCopy()(this.store);
            "restore" in scenario && await scenario.restore(this.store);
            this.logs.push(new RollbackLog(scenario.index, scenario.meta, storeBefore, deepCopy()(this.store)));
          }
          break;
        }
      }
  }
}

export { Transaction };