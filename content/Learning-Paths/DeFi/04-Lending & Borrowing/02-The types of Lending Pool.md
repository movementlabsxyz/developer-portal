# The types of Lending Pool

## Understanding Lending Pools and Guide to Building a DeFi Lending Platform

### Overview

In this series of articles, we will dive deep into understanding and building a decentralized lending platform (DeFi Lending Platform). Before we start coding, we need to understand the basic concepts of Lending Pools and how they work.

## What is a Lending Pool?

A Lending Pool is a liquidity pool where users can deposit tokens for lending, and others can borrow these tokens. This is the foundation of DeFi lending applications like Aave, Compound.

## Common Types of Lending Pools

### 1. Main Pool - Basic Pool

This is the most common type of pool in DeFi, with these characteristics:

- Users can deposit multiple types of tokens
- Uses an overcollateralized lending model
- Interest rates are automatically calculated based on supply and demand
- Collateral ratio typically ranges from 50-75% for security

### 2. Isolated Pool - Independent Pool

This type of pool is designed to minimize risk:

- Each pool supports only a specific token pair
- Risks are isolated, not affecting other pools
- Suitable for new tokens or high-risk assets
- Parameters like collateral ratio and interest rates can be customized

### 3. Leverage Pool

This pool is designed for professional traders:

- Allows high leverage borrowing (up to 10x)
- Direct integration with DEX
- Has automatic liquidation mechanisms to protect the pool
- Suitable for complex trading strategies

## Important Considerations When Designing Lending Pools

| Factor | Main Pool | Isolated Pool | Leverage Pool |
| --- | --- | --- | --- |
| Risk Level | Medium | Low | High |
| Collateral Ratio | 50-75% | Customizable | 10-50% |
| Complexity | Low | Medium | High |

In the following articles, we will delve into implementing each type of pool, starting with the Main Pool - the most basic type. We will learn how to design smart contracts, handle interest rate calculations, and implement necessary security mechanisms.
