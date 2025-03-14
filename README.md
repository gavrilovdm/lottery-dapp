# Lottery DApp

A decentralized application for participating in a lottery on the Base Sepolia Testnet blockchain.

## Project Description

This web application allows users to interact with a lottery smart contract deployed on the Base Sepolia Testnet. Users can:

- Connect their wallet
- Mint USDTFAKE tokens to participate in the lottery
- Purchase lottery tickets
- Check the current lottery round status
- View their transaction history
- Claim winnings (if the user becomes a winner)

## Architecture

### Frontend

- **Next.js** - React framework for creating web applications
- **Tailwind CSS** - for component styling
- **wagmi** - library for interacting with Ethereum
- **RainbowKit** - for wallet connection with beautiful UI
- **viem** - low-level library for interacting with Ethereum
- **@coinbase/onchainkit** - set of components for blockchain interaction

### Smart Contracts

- **LootGemLotteryMVP** - main lottery contract (0xe104D4444D65DA9F87153F1455956B2b2BdB31E2)
- **USDTFAKE** - token for lottery participation (0xc2Bc86eE3C524A5CD4550393DE9E350F79ec596c)

### Application Architecture

1. **Components**:
   - `Providers` - setup of providers for blockchain interaction
   - `ConnectButton` - button for wallet connection
   - `LotteryInfo` - information about the current lottery round
   - `BuyTicket` - component for ticket purchase
   - `MintTokens` - component for token minting
   - `UserTickets` - user's ticket history

2. **Contracts**:
   - Interfaces for interacting with lottery and token contracts
   - Contract ABIs

3. **Hooks**:
   - Custom hooks for reading contract data
   - Hooks for sending transactions

## Technical Solutions

1. **Blockchain Connection**:
   - Using RainbowKit for convenient wallet connection
   - Provider setup for Base Sepolia network

2. **Contract Interaction**:
   - Using wagmi for reading data and sending transactions
   - Data caching with TanStack Query

3. **UI/UX**:
   - Responsive design using Tailwind CSS
   - Modal windows for action confirmation
   - Transaction status notifications

4. **Event Handling**:
   - Contract event subscription for real-time UI updates
   - Display of user transaction history

## Running the Project

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run production version
npm run start
```

## Contracts

- Lottery contract: 0xe104D4444D65DA9F87153F1455956B2b2BdB31E2
- Game token: 0xc2Bc86eE3C524A5CD4550393DE9E350F79ec596c
