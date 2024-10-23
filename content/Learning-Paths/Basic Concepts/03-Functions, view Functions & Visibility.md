# Functions, view Functions & Visibility

## Function

### Overview

Function syntax in Move is shared between module functions and script functions. Functions inside of modules are reusable, whereas script functions are only used once to invoke a transaction.

### Declaring Address Variables

```rust
fun name(params: type): return_type {
    todo!()
}
// example
fun plus(what_plus: u64): u64 {
    let result = 0 + what_plus;
    return result;
}

```

---

## View Function

### Definition

A view function is a function that retrieves data from the blockchain without making any changes. It is used to read and display data stored on the blockchain.

### Importance

View functions are important in the Movement blockchain because:

- They allow external applications to access and display data on the blockchain without direct access to the blockchain.
- They improve the efficiency and security of the blockchain network.

### Benefits

- Create a GET API structure to display complex states of smart contracts.
- Simplify the process of retrieving complex data, saving time and resources.
- Significantly improve the usability of the Aptos blockchain.
- Make the blockchain more accessible to developers.

### How to Use

Use the `#[view]` decorator to define a view function:

```rust
#[view]
public fun get_todos(todo_address: address): vector<String> acquires TodoStore {
    borrow_global<TodoStore>(todo_address).todos
}

```

### Advantages

- Retrieve complex states from smart contracts more efficiently.
- Define functions that return specific data from smart contracts.
- Provide a simple API for external invokers to retrieve data from the blockchain.
- Receive specific required data instead of the entire database with each query.

### Conclusion

Significantly improving its usability and accessibility. They help developers create more efficient applications by simplifying the process of retrieving data from the blockchain.

---

## Function Visibilities

### Private

- The functions can only be used within the module where they are defined.
- Think of them as "module-only" functions. No other module or script can access them.

```python
module movement::PrivModule {
    fun pri_func(): u8 {
        return 0;
    }
}

module movement::PublModule {
    fun other_func(): u8 {
        // This will error
        let result: u8 = movement::PrivModule::pri_func(); // Error
        return result;
    }
}

```

### Public

- The functions can be used by any other module or script.
- They are like "open to everyone" functions.

```rust
module movement::PrivModule {
    use std::debug::print;

    fun pri_func(): u8 {
        return 0
    }

    fun call_public_func() {
        let result = movement::PublModule::public_func();
        print(&result);
    }

    #[test]
    fun test_call_public_func() {
        call_public_func();
    }
}

module movement::PublModule {
    public fun public_func(): u8 {
        return 0
    }
}

```

### Public(friend)

- The functions can be used by the module where they are defined and by specific modules listed as "friends." - It’s like having "VIP access" that only selected friends can use these functions.

```rust
module movement::PrivModule {
    use std::debug::print;

    fun call_public_func() {
        // This will error
        let result = movement::PublModule::public_func(); // Error
        // This will error
                     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Invalid call to
        // This will error
                     '(movement=0xDB8A45E0E06D2BD305CDB824FDA101CEC6A24721CB03188C5543A5E5A8C3F3B0)::PublModule::public_func'
        print(&result);
    }
}

module movement::PublModule {
    public(friend) fun public_func(): u8 {
        return 0
    }
}

```

To allow `PrivModule` to call `public(friend)` from within `PublModule`, we need to add `PrivModule` to the friend list of `PublModule` by doing the following:

```rust
module movement::PrivModule {
    use std::debug::print;

    fun call_public_func() {
        let result = movement::PublModule::public_func();
        print(&result);
    }

    #[test]
    fun test_call_public_func() {
        call_public_func();
    }
}

module movement::PublModule {
    friend movement::PrivModule;

    public(friend) fun public_func(): u8 {
        return 0
    }
}

```

### Entry

- These are special functions where the Move program starts running or where the user can call into the contract.
- You can combine "entry" with "public" or "public(friend)" to specify who can initiate execution.

Example:

```rust
module movement::FunctionVisibilities {
    use std::string::utf8;
    use std::debug::print;

    public(friend) entry fun internal_transfer() { // public friend entry
        print(&utf8(b"internal transfer"));
    }

    public entry fun pub_transfer() { // public entry
        print(&utf8(b"public transfer"));
    }

    entry fun transfer(){ // private entry
        print(&utf8(b"transfer"));
    }
}

```

- Movement CLI

```bash
movement move publish --named-addresses movement=default
```

- Result

```json
{
  "Result": {
    "transaction_hash": "0x995bff9d25cbb2863b1171d097e3af93c2c1867b0325ceeb1bd3ec44c841270a",
    "gas_used": 1280,
    "gas_unit_price": 100,
    "sender": "bcbcad47635cf19f831e82a0abd0775b4892cb79bb8600592a99e73c727f717c",
    "sequence_number": 0,
    "success": true,
    "timestamp_us": 1726818525771069,
    "version": 17512651,
    "vm_status": "Executed successfully"
  }
}

```

Call Entry Function

```bash
movement move run --function-id 'default::FunctionVisibilities::internal_transfer'
movement move run --function-id 'default::FunctionVisibilities::pub_transfer'
movement move run --function-id 'default::FunctionVisibilities::transfer'

```

```json
{
  "Result": {
    "transaction_hash": "0xdf1e9661d7408034273fa49a8cecb4ca7acc2656705b348e0aee76a2a4799ce7",
    "gas_used": 3,
    "gas_unit_price": 100,
    "sender": "e084b2010bb36fb4802d2c8bad7c66ade3728b202a30e330e58cd1904d65a043",
    "sequence_number": 2,
    "success": true,
    "timestamp_us": 1726819967229264,
    "version": 2034,
    "vm_status": "Executed successfully"
  }
}

```