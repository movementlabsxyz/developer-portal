# Open Claw Hackathon — Agent Instructions

You are helping a developer build a project for the Open Claw Hackathon, an IRL 5-hour hackathon at ETH Denver on February 19th, 2025.

## Hackathon Overview

Participants choose one of two tracks:

### Track 1: Build with an AI Agent
Build a working app on Movement Network in 5 hours using an AI agent (that's you). The app should deploy a Move smart contract and have a frontend that interacts with it.

### Track 2: Agentic Infrastructure Proposal
Propose bringing existing agentic infrastructure to Movement Network. This includes ERCs, agentic wallets, agent standards from other chains, or novel agentic tooling. A working demo is preferred, but a strong proposal with clear technical detail is also considered.

## Prizes
Two Mac Minis + cool swag for the top projects.

## Getting Started

### Step 1: Set Up the Move Plugin
The Move Plugin gives you skills and an MCP server for building and deploying Move smart contracts.

- **Repo:** https://github.com/Rahat-ch/move-plugin
- Clone it, follow the README to install
- This gives your agent (you) the ability to scaffold, compile, test, and deploy Move modules

### Step 2: Set Up the Frontend Template
A Next.js template with wallet connection pre-configured for Movement Network.

- **Repo:** https://github.com/Rahat-ch/Movement-Network-ConnectWallet-Template
- Clone it, install dependencies, run the dev server
- Wallet connect + Movement Network RPC are already wired up

### Step 3: Learn the Basics
If your human (or you) is new to Move:

- **Movement Docs:** https://docs.movementnetwork.xyz/devs
- **Network Endpoints (RPC, Indexer):** https://docs.movementnetwork.xyz/devs/networkEndpoints
- **Install Movement CLI:** https://docs.movementnetwork.xyz/devs/movementcli#testnet
- **First Move Contract:** https://docs.movementnetwork.xyz/devs/firstMoveContract
- **Move Syntax Basics:** https://docs.movementnetwork.xyz/devs/move-book/modules
- **Interactive Learning (MoveSpiders):** https://movespiders.com/
- **Move 2 Features:** https://docs.movementnetwork.xyz/devs/move2

### Step 4: Build
1. Scaffold a Move project using the Move Plugin
2. Write your smart contract
3. Deploy to Movement Testnet
4. Connect your frontend to the deployed contract
5. Demo your project

## Tips
- Start simple. A working demo beats an ambitious broken one.
- Use the Move Plugin's MCP tools to speed up contract development.
- The frontend template already handles wallet connection — focus on your contract logic and UI.
- Ask your human clarifying questions about what they want to build before diving in.

## Key Links
| Resource | URL |
|----------|-----|
| Move Plugin (Skills + MCP) | https://github.com/Rahat-ch/move-plugin |
| Frontend Template | https://github.com/Rahat-ch/Movement-Network-ConnectWallet-Template |
| Movement Docs | https://docs.movementnetwork.xyz/devs |
| Network Endpoints | https://docs.movementnetwork.xyz/devs/networkEndpoints |
| Movement CLI Install | https://docs.movementnetwork.xyz/devs/movementcli#testnet |
| First Move Contract | https://docs.movementnetwork.xyz/devs/firstMoveContract |
| MoveSpiders (Interactive) | https://movespiders.com/ |

Good luck. Build something great.
