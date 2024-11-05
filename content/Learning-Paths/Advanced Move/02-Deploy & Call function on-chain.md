# Deploy & Call function on-chain

## Summary

- Explores deploying modules and calling on-chain functions on the Movement testnet
- Covers setup of Movement environment and project initialization
- Demonstrates creating and publishing a Move smart contract
- Shows how to interact with deployed modules using the Movement explorer
- Focuses on understanding on-chain operations and global storage in Move
- Provides step-by-step instructions for developers new to the Movement ecosystem

## Overview

To better understand how on-chain operations or global storage work, we will explore together the process of deploying modules (smart contracts) on the Movement testnet, and then try calling on-chain functions through the explorer to gain a clearer understanding of them.

## 1. Setup Movement Environment

First, you need to set up your development environment. Follow the guide in the Movement documentation to set up the Suzuka network.

https://docs.movementnetwork.xyz/devs/getstarted

## 2. Initialize Project

- **Initialize your Aptos profile** for package development and add Movement as a custom network:

```ruby
aptos init --network custom --rest-url https://aptos.testnet.suzuka.movementlabs.xyz/v1
```

```bash
❯ aptos init --network custom --rest-url https://aptos.testnet.suzuka.movementlabs.xyz/v1
Configuring for profile default
Configuring for network Custom
Using command line argument for rest URL https://aptos.testnet.suzuka.movementlabs.xyz/v1
Enter your faucet endpoint [Current: None | No input: Skip (or keep the existing one if present) | 'skip' to not use a faucet]
    
No faucet url given, skipping faucet...
Enter your private key as a hex literal (0x...) [Current: None | No input: Generate new key (or keep one if present)]

No key given, generating key...
Account 0x7d470166da365d4ab4ac22c0159827ca0502c0b971ad2f9edda8e493332290c4 has been initialized locally, but you must transfer coins to it to create the account onchain

---
Aptos CLI is now set up for account 0x7d470166da365d4ab4ac22c0159827ca0502c0b971ad2f9edda8e493332290c4 as profile default!
 See the account here: https://explorer.aptoslabs.com/account/0x7d470166da365d4ab4ac22c0159827ca0502c0b971ad2f9edda8e493332290c4?network=custom
 Run `aptos --help` for more information about commands
{
  "Result": "Success"
}
```

> In the returned result, we will have the account: `0x7d470166da365d4ab4ac22c0159827ca0502c0b971ad2f9edda8e493332290c4`. This will be the account you'll use to execute default functions and deploy code. Alternatively, you can check these details in the `/.aptos/config.yaml` file.
> 

```yaml
---
profiles:
  default:
    network: Custom
    private_key: "0x7423d9d69830987a371836e6ea417a5a5626c119ab9c2a868e85cb890e114587"
    public_key: "0x4d2491d2c2ead56335cd960c484cf8a3ab9c4a6476fc0b9b6ef6a8dfa1e7c566"
    account: 7d470166da365d4ab4ac22c0159827ca0502c0b971ad2f9edda8e493332290c4
    rest_url: "https://aptos.testnet.suzuka.movementlabs.xyz/v1"
```

- Initialize your move project

```ruby
movement move init --name hello_blockchain
```

## 3. Create a Move file in sources/name.move

Initialize a .move file in the sources/ folder and copy the code from the previous topic into it:

```ruby
module movement::local_global_storage {
    use std::debug::print;
    use std::signer::address_of;

    struct GlobalData has key {
        value: u64
    }

    const EResourceNotExist: u64 = 33;

    public entry fun new_global(signer: &signer, value: u64) {
        let data = GlobalData {
            value: value
        } ;
        move_to(signer, data);
    }

    public entry fun change_value_from_global_storage(signer: &signer, value: u64) acquires GlobalData {
        let addr = address_of(signer);
        if (!check_global_storage_exists(addr)) {
            abort EResourceNotExist
        };

        let value_reference = &mut borrow_global_mut<GlobalData>(addr).value;
        *value_reference = *value_reference + value;
    }

    public fun check_global_storage_exists(addr: address): bool {
        exists<GlobalData>(addr)
    }

    #[view]
    public fun get_value_from_global_storage(addr: address): u64 acquires GlobalData {
        if (!check_global_storage_exists(addr)) {
            abort EResourceNotExist
        };
        let value_reference = borrow_global<GlobalData>(addr);
        value_reference.value
    }

    #[test(account = @0x1)]
    fun test_new_global(account: &signer) {
        new_global(account, 10);
    }
}
```

1. Modify Move.toml

```toml
[package]
name = "move-101"
version = "1.0.0"
authors = []

[addresses]
# Change your address you created in step 1
movement = "0x7d470166da365d4ab4ac22c0159827ca0502c0b971ad2f9edda8e493332290c4" 

[dev-addresses]

[dependencies.AptosFramework]
git = "https://github.com/aptos-labs/aptos-core.git"
rev = "mainnet"
subdir = "aptos-move/framework/aptos-framework"

[dev-dependencies]

```

1. Publish your module to the blockchain

```bash
movement move publish --named-addresses movement=default
```

- If executed successfully, the result will appear as shown below:

```bash
Compiling, may take a little while to download git dependencies...
UPDATING GIT DEPENDENCY https://github.com/aptos-labs/aptos-core.git
INCLUDING DEPENDENCY AptosFramework
INCLUDING DEPENDENCY AptosStdlib
INCLUDING DEPENDENCY MoveStdlib
BUILDING move-101
package size 1945 bytes
Transaction submitted: https://explorer.aptoslabs.com/txn/0x852c187c3290dbf33eb1bff10f6e2a4639c44ada1aa2b0941b087908f6b17596?network=custom
{
  "Result": {
    "transaction_hash": "0x852c187c3290dbf33eb1bff10f6e2a4639c44ada1aa2b0941b087908f6b17596",
    "gas_used": 1689,
    "gas_unit_price": 100,
    "sender": "7d470166da365d4ab4ac22c0159827ca0502c0b971ad2f9edda8e493332290c4",
    "sequence_number": 0,
    "success": true,
    "timestamp_us": 1727447905936816,
    "version": 258811098,
    "vm_status": "Executed successfully"
  }
}
```

1. Check the transaction on the Movement testnet explorer using this link: https://explorer.movementlabs.xyz/?network=testnet
    
    ![Screenshot 2024-09-27 at 22.22.45.png](/content-images/Deploy%20&%20Call%20function%20on_chain/Screenshot_2024-09-27_at_22.22.45.png)
    
2. Alternatively, you can search using the account address and navigate to the "Modules" tab: `0x7d470166da365d4ab4ac22c0159827ca0502c0b971ad2f9edda8e493332290c4`
    
    ![Screenshot 2024-09-27 at 22.17.40.png](/content-images/Deploy%20&%20Call%20function%20on_chain/Screenshot_2024-09-27_at_22.17.40.png)
    
3. Run and View will list the functions available in your module.
    
    ![Screenshot 2024-09-27 at 22.24.15.png](/content-images/Deploy%20&%20Call%20function%20on_chain/Screenshot_2024-09-27_at_22.24.15.png)