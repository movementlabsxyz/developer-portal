# Building On-Chain Voting with Signature Verification on Movement

This tutorial walks through building a complete on-chain voting system using Move smart contracts, Ed25519 signature verification for off-chain eligibility, and a Next.js frontend with wallet integration.

## Architecture Overview

```
User connects wallet → Frontend checks eligibility via API →
API verifies XP on Parthenon → Signs eligibility proof (Ed25519) →
User submits vote tx with signature → Contract verifies signature on-chain →
Vote recorded, 1-vote-per-address enforced
```

**Key design decision:** Eligibility is checked off-chain (server has API key) but **enforced on-chain** via cryptographic signature verification. The server signs a message proving the user is eligible, and the contract verifies that signature before accepting the vote.

## 1. Smart Contract Design (Move)

### Resources

The contract stores all voting state in a single resource:

```move
struct VotingState has key {
    votes: vector<u64>,              // index = candidate, value = count
    voters: SimpleMap<address, u64>, // voter -> candidate they voted for
    num_candidates: u64,
    is_paused: bool,
    admin: address,
    admin_public_key: ed25519::UnvalidatedPublicKey,
}
```

### Vote Function with Signature Verification

The `vote` entry function enforces all invariants:

1. Voting is not paused
2. Candidate ID is valid
3. Voter hasn't already voted
4. Signature hasn't expired
5. Ed25519 signature is valid against stored admin public key

The message being signed is BCS-encoded: `bcs::to_bytes(voter_address) ++ bcs::to_bytes(candidate_id) ++ bcs::to_bytes(expiry)`

This prevents replay attacks (address-bound), vote manipulation (candidate-bound), and stale eligibility (time-bound).

### View Functions

Three view functions expose read-only state:
- `get_votes()` - returns vote counts for all candidates
- `has_voted(addr)` - checks if an address has voted
- `get_voter_choice(addr)` - returns which candidate they voted for

### Deployment

```bash
movement move publish --named-addresses peoples_choice=default --profile default
```

After deployment, initialize with:
```bash
movement move run --function-id 'default::peoples_choice::initialize' --args u64:5 'hex:<admin_public_key_hex>' --profile default --assume-yes
```

## 2. Ed25519 Keypair Generation

Generate the keypair that links your API server to the contract:

```typescript
import { Ed25519PrivateKey } from "@aptos-labs/ts-sdk";

const privateKey = Ed25519PrivateKey.generate();
console.log("Private key (for .env):", privateKey.toString());
console.log("Public key (for contract init):", privateKey.publicKey().toString());
```

- **Private key** goes in `.env.local` as `ELIGIBILITY_SIGNER_KEY`
- **Public key** goes to the contract's `initialize()` call

## 3. API Route - Eligibility Check + Signing

The API route (`/api/check-eligibility`) does three things:

1. Fetches user XP from the Parthenon REST API (server-side, using API key)
2. If XP >= 100, signs a BCS-encoded eligibility proof with Ed25519
3. Returns the signature + expiry for the frontend to include in the vote transaction

The message must be BCS-encoded to match what the contract reconstructs on-chain:

```typescript
import { Ed25519PrivateKey, AccountAddress, Serializer } from "@aptos-labs/ts-sdk";

async function signEligibility(address: string, candidateId: number, expiry: number) {
  const privateKey = new Ed25519PrivateKey(process.env.ELIGIBILITY_SIGNER_KEY!);

  // BCS-encode each field to match the contract's bcs::to_bytes() calls
  const addrBytes = AccountAddress.from(address).bcsToBytes();

  const candidateSer = new Serializer();
  candidateSer.serializeU64(candidateId);
  const candidateBytes = candidateSer.toUint8Array();

  const expirySer = new Serializer();
  expirySer.serializeU64(expiry);
  const expiryBytes = expirySer.toUint8Array();

  // Concatenate: bcs(address) ++ bcs(candidate_id) ++ bcs(expiry)
  const message = new Uint8Array([...addrBytes, ...candidateBytes, ...expiryBytes]);

  const signature = privateKey.sign(message);
  return signature.toString();
}
```

The Parthenon API is called as a REST endpoint:

```typescript
const res = await fetch(
  `https://parthenon-api.movementlabs.xyz/api/users/xp-by-address?address=${address}`,
  { headers: { "X-API-KEY": process.env.PARTHENON_API_KEY! } }
);
const data = await res.json();
const xp = data?.data?.xp ?? 0;
```

## 4. Wallet Integration (Next.js)

### Scoped Provider

Wrap only the voting page in `AptosWalletAdapterProvider` to avoid loading wallet code across the entire site:

```tsx
// layout.tsx (scoped to /events/peopleschoice)
import { AptosConfig, Network } from "@aptos-labs/ts-sdk";

const aptosConfig = new AptosConfig({
  network: Network.MAINNET,
  fullnode: "https://mainnet.movementnetwork.xyz/v1",
});

<AptosWalletAdapterProvider
  autoConnect={true}
  dappConfig={aptosConfig}
  onError={(error) => console.error("Wallet error:", error)}
>
  {children}
</AptosWalletAdapterProvider>
```

### Vote Submission

The signature from the API is a hex string that must be converted to `Uint8Array` before passing as a `vector<u8>` argument to the contract:

```tsx
const { signAndSubmitTransaction } = useWallet();

// Convert hex signature to bytes
const sigHex = signature.replace(/^0x/, "");
const sigBytes = new Uint8Array(
  sigHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
);

const response = await signAndSubmitTransaction({
  sender: account.address,
  data: {
    function: `${MODULE_ADDRESS}::peoples_choice::vote`,
    functionArguments: [candidateId, sigBytes, expiry],
  },
});

// Wait for on-chain confirmation
const txResult = await aptos.waitForTransaction({
  transactionHash: response.hash,
  options: { checkSuccess: true },
});

if (!txResult.success) {
  // Handle failure
}
```

## 5. Frontend State Machine

The voting page follows a clear state machine:

```
DISCONNECTED → [connect wallet] → CONNECTED → CHECKING_ELIGIBILITY
  → ELIGIBLE → [click vote] → VOTING → VOTED
  → INELIGIBLE (show XP requirement)
  → ALREADY_VOTED (show which project)
  → ERROR (show message + try again)
```

Vote counts are polled every 15 seconds via view function calls and visible to all users regardless of wallet connection.

## Security Considerations

- **BCS encoding:** Both server and contract must construct identical messages using BCS serialization — text encoding won't match
- **Signature format:** The API returns a hex string, but the contract expects raw bytes (`vector<u8>`). The frontend must convert hex to `Uint8Array` before submitting
- **Replay prevention:** Signature binds to specific address + candidate + expiry window
- **Server authority:** Only the server with the private key can produce valid eligibility proofs
- **On-chain enforcement:** Contract verifies everything; the server cannot force a double-vote
- **Admin controls:** Pause/unpause for emergency situations
- **No API key exposure:** Parthenon API key stays server-side

## Environment Variables

```
PARTHENON_API_KEY=<your-parthenon-key>
ELIGIBILITY_SIGNER_KEY=<ed25519-private-key-hex>
NEXT_PUBLIC_CONTRACT_ADDRESS=<deployed-contract-address>
```
