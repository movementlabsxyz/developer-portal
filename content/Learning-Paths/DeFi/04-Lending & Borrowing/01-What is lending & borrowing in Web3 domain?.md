# What is DeFi Lending & Borrowing?

### Overview

DeFi Lending & Borrowing is a fully automated cryptocurrency lending and borrowing system that operates on the blockchain. Let's understand in detail how it works through specific examples.

## Multiple Liquidity Pools

Modern DeFi platforms typically offer multiple liquidity pools for different cryptocurrencies. Users can choose to lend or borrow various assets like USDT, ETH, BTC, and other supported tokens. Each pool operates independently with its own:

- Interest rates based on supply and demand
- Collateral requirements and ratios
- Total liquidity and utilization rates

## Detailed Operating Mechanism

Let's look at examples across different pools:

### 1. Creating the Liquidity Pools

Alice can deposit different assets into various pools:

- 1000 USDT into the USDT pool
- 10 ETH into the ETH pool
- 0.5 BTC into the BTC pool

### 2. Borrowing Process

- Bob can borrow from any available pool based on his needs
- He can use ETH as collateral to borrow USDT (cross-collateral)
- Or use BTC to borrow ETH, and so on
- Each pool has its own collateral ratio requirements

### 3. During the Loan Period

- Interest rates vary between different pools
- Each pool has its own minimum collateral ratio
- If collateral value drops below the safe ratio, Bob must:
- Add more collateral, or
- Repay part of the loan to maintain the safe ratio

### 4. Loan Completion

- Bob repays the borrowed amount + interest
- The smart contract automatically returns the collateralized assets
- Lenders receive their share of interest based on their contribution to the pool

## Common Use Cases

### 1. Borrowing for Investment (Leverage)

Bob believes ETH price will increase. Instead of selling ETH, Bob collateralizes ETH to borrow USDT and buy more ETH.

### 2. Borrowing for Payments

Carol urgently needs USDT but doesn't want to sell BTC. She can collateralize BTC to borrow USDT, then repay when she has the money.

### 3. Lending for Passive Income

Alice wants to generate income from her crypto holdings. She can distribute her assets across different pools to optimize returns and diversify risk.

In the following articles, we will learn how to build a simple smart contract to implement the basic functions of a multi-pool lending platform like this.
