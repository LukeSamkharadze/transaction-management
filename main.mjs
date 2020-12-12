import { Transaction } from "./transaction.mjs"
import { Validator } from "./validator.mjs"

const scenarios = [
  {
    index: 1,
    meta: {
      title: 'Read popular customers',
      description: 'This action is responsible for reading the most popular customers'
    },
    call: async (store) => { store.n = 1; },
    restore: async (store) => { delete store.n; }
  },
  {
    index: 3,
    meta: {
      title: 'Do something with popular customers',
      description: 'Bla bla bla bla'
    },
    isCritical: true,
    call: async (store) => { throw new Error(":D:D:D:D:D:D") },
  },
  {
    index: 2,
    meta: {
      title: "Sort popular customers",
      description: 'Sorting using quicksort',
    },
    call: async (store) => { store.n *= 10; },
    call: async (store) => { store.n *= 10; },
    restore: async (store) => { store.n /= 10; }
  }
];

let validator = new Validator();
validator.ValidateScenarios(scenarios);

let transaction = new Transaction();
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
