import { Transaction } from "./transaction";
import { ScenariosValidator, ScenarioValidator, Validator } from "./validator";
import { Scenario } from "./scenario";

const scenarios: Scenario[] = [
  new Scenario(
    1,
    "Read popular customers",
    "This action is responsible for reading the most popular customers",
    async (store) => { store.n = 1; },
    async (store) => { delete store.n; }),
  new Scenario(
    3,
    "Do something with popular customers",
    "Bla bla bla bla",
    async (store) => { throw new Error(":D:D:D:D:D:D") },
    undefined,
    false
  ),
  new Scenario(
    2,
    "Sort popular customers",
    "Sorting using quicksort",
    async (store) => { store.n *= 10; },
    async (store) => { store.n /= 10; }
  )
]

let scenariosValidator: Validator<Scenario[]> = new ScenariosValidator(new ScenarioValidator());
scenariosValidator.Validate(scenarios);

let transaction = new Transaction({});
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
