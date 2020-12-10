import deepCopy from "rfdc";
import { SuccessfulLog, FailedLog } from "./log.mjs";

class Transaction {
  constructor() {
    this.store = {};
    this.logs = [];
  }

  async DispatchScenarios(scenarios) {
    scenarios.sort((o, oo) => o.index - oo.index);

    for (var [id, scenario] of scenarios.entries())
      try {
        let storeBefore = deepCopy()(this.store);
        await scenario.call(this.store);
        this.logs.push(new SuccessfulLog(scenario.index, scenario.meta, storeBefore, deepCopy()(this.store)));
      }
      catch (error) { this.logs.push(new FailedLog(scenario.index, scenario.meta, error)); break; }

    for (var [id, scenario] of scenarios.slice(0, id).reverse().entries())
      return await "restore" in scenario && scenario.restore(this.store);
  }
}

export { Transaction };