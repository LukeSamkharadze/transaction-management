#### Personal project JavaScript

**Complexity**: Hard

**Name**: Transaction module

Implement a transaction management module.

**Description:** 

The transaction has to contain a mechanism for combining several steps into one entity. — `scenarios`.

The scenario contains a steps, and each step contains control methods: `call` and `restore`, and also properties `index` and `meta`. All properties except `restore` are required.

The `index` property is responsible for the order in which the step is executed.

The `meta` property is responsible for the description of the transaction step and includes the fields: ` title` and `description`. Both fields are required.

The `call` method contains instructions for performing an action for a current step.

The `restore` method is optional. This method is responsible for the action to be taken to roll back the transaction.

If the `restore` method is not specified, then errors that occur during the execution of the ` call` method do not affect the decisions of the transaction module about rolling back the transaction.

**Transaction results**:

-   SUCCEED 
-   FAILED
    -   restored without error (If all steps were successfully rollbacked)
    -   restored with error (one of the step's rollback was unsuccessful)

**Main functionality**

-   Creating a new transaction based on a business scenario.
-   Performing a transaction using the `dispatch` method.
-   Rollback of all steps if an error occurred on some of the steps.
-   Logging of all actions and all errors.
-   Data availability at each step using the parameter `store`.
-   After starting a transaction, the property `store` appears in the ` transaction` object with the value `{}` or `null`.
-   If `transaction.store` returns ` null`, this means that the rollback mechanism was successfully launched.
-   Generate error if transaction rollback failed.
-   In the `logs` property, you must store an array of objects, where each object contains a step execution state.

**Example**:

```javascript
const scenario = [
    {
        index: 1,
        meta: {
            title: 'Read popular customers'
            description: 'This action is responsible for reading the most popular customers'
        },
				// callback for main execution
        call: async (store) => {},
				// callback for rollback
        restore: async (store) => {}
    }
];

const transaction = new Transaction();

(async() => {
    try {
			await transaction.dispatch(scenario);
			const store = transaction.store; // {} | null
			const logs = transation.logs; // []
    } catch (err) {
			// log detailed error
    }
})();
```

**Structure `logs`**

```js
[
    {
        index: 1,
        meta: {
            title: 'Read popular customers'
            description: 'This action is responsible for reading the most popular customers'
        },
        storeBefore: {},
        storeAfter: {},
        error: null
    },
    {
        index: 2,
        meta: {
            title: 'Add customer'
            description: 'This action will add some customer'
        },
        error: {
            name: 'TypeError',
            message: 'name is not a function',
            stack: 'Stack trace'
        }
    }
]
```

