import { Validator } from "./validator"
import ScenValidator = Validator.ScenarioValidator
import ScensValidator = Validator.ScenariosValidator

import { Transaction } from "./transaction"
import trans = Transaction.Transaction

import { Scenario } from "./scenario"
import Scen = Scenario.Scenario
import Meta = Scenario.Meta

import { Decorators } from "./decorators"

const scenarios: Scen[] = [
  new Scen(
    1,
    new Meta("Read popular customers", "This action is responsible for reading the most popular customers"),
    async (store) => { store.n = 1; },
    async (store) => { delete store.n; }),
  new Scen(
    3,
    new Meta("Do something with popular customers", "Bla bla bla bla"),
    async (store) => { throw new Error(":D:D:D:D:D:D") },
    undefined,
    false
  ),
  new Scen(
    2,
    new Meta("Sort popular customers", "Sorting using quicksort"),
    async (store) => { store.n *= 10; },
    async (store) => { store.n /= 10; }
  )
]

// Added decorator validation :)
// let scenariosValidator = new ScensValidator(new ScenValidator());
// scenariosValidator.Validate(scenarios);

let transaction = new trans({});
(async () => {
  try {
    await transaction.DispatchScenarios(scenarios);
    let store = transaction.store;
    let logs = transaction.logs;

    console.log(store);
    console.log(logs);
    console.log(`Scenario Constructor was called ${Decorators.counter.get("scenarioConstructor")} times`);
  } catch (error) {
    console.log(error);
  }
})();