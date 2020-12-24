import { Validator } from "./validator";
import { Transaction } from "./transaction";
import { Scenario } from "./scenario";

type ScenType = Scenario.Scenario;
let Scen = Scenario.Scenario;
let ScenValidator = Validator.ScenarioValidator;
let ScensValidator = Validator.ScenariosValidator;

let trans = Transaction.Transaction;

const scenarios: ScenType[] = [
  new Scen(
    1,
    "Read popular customers",
    "This action is responsible for reading the most popular customers",
    async (store) => { store.n = 1; },
    async (store) => { delete store.n; }),
  new Scen(
    3,
    "Do something with popular customers",
    "Bla bla bla bla",
    async (store) => { throw new Error(":D:D:D:D:D:D") },
    undefined,
    false
  ),
  new Scen(
    2,
    "Sort popular customers",
    "Sorting using quicksort",
    async (store) => { store.n *= 10; },
    async (store) => { store.n /= 10; }
  )
]
console.log(scenarios.map(o => o.index));
let scenariosValidator = new ScensValidator(new ScenValidator());
scenariosValidator.Validate(scenarios);

let transaction = new trans({});
(async () => {
  try {
    await transaction.DispatchScenarios(scenarios);
    let store = transaction.store; // {} | null
    let logs = transaction.logs; // []

    console.log(store);
    console.log(logs);
  } catch (error) {
    console.log(error);
  }
})();
