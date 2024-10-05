# Resource Groups

<aside>
💡

**Summary:**

- Resource groups in Move allow grouping of multiple resources with different fields.
- They function similarly to regular resources but offer more efficient storage.
- Resources in a group are stored close together in global storage memory.
- This proximity ensures quicker queries and reduced processing costs.
- The code example demonstrates creating and using resource groups with multiple fields.
- Resource groups are a current solution for complex resources, with `objects` feature planned for future optimization.
</aside>

In real-world projects, sometimes one of your resources will have many different fields. Although in the future we may use the `objects` feature to optimize complex resources (which will be shared in upcoming topics), for now we can also create resources and group them together in a group. Below is an example:

```ruby
module movement::resource_group {
    use std::string::{utf8, String};
    use std::signer::address_of;

    #[resource_group(scope = global)]
    struct MovementGroup {}

    #[resource_group_member(group = MovementGroup)]
    struct Group1 has key {
        field1: u64,
        field2: String,
        field3: address,
        field4: bool
    }

    #[resource_group_member(group = MovementGroup)]
    struct Group2 has key {
        field5: u64,
        field6: String,
        field7: address,
        field8: bool
    }

    public entry fun create_group_resource(account: &signer) {
        let addr = address_of(account);
        let group1 = Group1 {
            field1: 100,
            field2: utf8(b"hello"),
            field3: addr,
            field4: true
        };
        move_to(account, group1);

        let group2 = Group2 {
            field5: 200,
            field6: utf8(b"hello 2"),
            field7: addr,
            field8: false
        };
        move_to(account, group2);
    }

    #[view]
    public fun get_gresource_one(addr: address): u64 acquires Group1 {
        borrow_global<Group1>(addr).field1
    }

    #[view]
    public fun get_gresource_two(addr: address): u64 acquires Group2 {
        borrow_global<Group2>(addr).field5
    }

    #[test(account = @0x1)]
    fun test_create_group(account: &signer){
        create_group_resource(account);
    }
}
```

> Running test:
> 

```rust
movement move test -f test_create_group
```

> Result:
> 

```rust
Running Move unit tests
[ PASS    ] 0x5fdf6936671d4e4a89b686aff0b5a4dfe083babbaaa6e78f5daa8801f94938a6::resource_group::test_create_group
Test result: OK. Total tests: 1; passed: 1; failed: 0
{
  "Result": "Success"
}
```

> In terms of functionality and usage, Resource groups are not different from regular resources—they only support more efficient storage. In the memory of global storage, these resources are stored close to each other, ensuring quick queries and reduced processing costs/fee.
> 

![image.png](Resource%20Groups%20c0b63164896343538b331979b0e01238/image.png)