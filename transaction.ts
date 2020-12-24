import deepCopy from "rfdc";
import { Scenario } from "./scenario"
import { Log } from "./log";

type Log = Log.Log;
let sucLog = Log.SuccessfulLog;
let failLog = Log.FailedLog;
let silentLog = Log.SilentFailedLog;
let rollLog = Log.RollbackLog;

export namespace Transaction {
  export class Transaction {
    constructor(public store: any, public logs: Log[] = []) { }

    async DispatchScenarios(scenarios: Scenario.Scenario[]) {
      scenarios.sort((o, oo) => o.index - oo.index);
      try {
        for (var [id, scenario] of scenarios.entries())
          await this.DispatchScenario(scenario, scenario.call, sucLog, scenario.index, scenario.meta)
      }
      catch (error) {
        this.logs.push(new failLog(scenario.index, scenario.meta, error));
        scenarios.slice(0, id).reverse().forEach(async o => "restore" in o && await this.DispatchScenario(o, o.restore!, rollLog, o.index, o.meta));
      }
    }

    async DispatchScenario(scenario: Scenario.Scenario, method: (store: any) => void, dispatchType: new (...args: any[]) => any, ...args: any[]) {
      let storeBefore = deepCopy()(this.store);
      try {
        await method(this.store);
        this.logs.push(new dispatchType(...args.concat([storeBefore, deepCopy()(this.store)])));
      }
      catch (error) {
        if ("isCritical" in scenario && scenario.isCritical) throw error;
        this.logs.push(new silentLog(scenario.index, scenario.meta, storeBefore, deepCopy()(this.store), error));
      }
    }
  }
}