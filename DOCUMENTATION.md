# Lottery DApp Documentation

## Project Overview
This is a decentralized lottery application built with Next.js, React, and blockchain technologies. The application allows users to buy lottery tickets, view their tickets, and participate in lottery rounds.

## Project Structure

### Main Directories
- `/app`: Contains the main application code
  - `/components`: React components for the UI
  - `/hooks`: Custom React hooks for blockchain interactions
  - `/contracts`: Contract ABIs and addresses
  - `/svg`: SVG assets
- `/components`: Shared UI components (shadcn/ui)
- `/contracts`: Smart contract source code

## Key Components

### Main Application Components

#### `BuyTicket.tsx`
- Allows users to buy lottery tickets
- Handles token approval and ticket purchase
- Shows ticket price and user balance

#### `MintTokens.tsx`
- Allows users to mint test USDT tokens
- Shows current token balance
- Handles token minting transactions

#### `UserTickets.tsx`
- Displays all tickets purchased by the user
- Fetches ticket data from blockchain events
- Shows ticket details including round ID and price

#### `LotteryInfo.tsx`
- Displays information about the current lottery round
- Shows prize pool, ticket price, and round status
- Allows admins to create new rounds

### Lottery Components

#### `RoundDetails.tsx`
- Displays detailed information about a lottery round
- Shows status, prize pool, ticket price, and timing

#### `TransactionStatus.tsx`
- Displays transaction status notifications
- Shows waiting, processing, success, and error states
- Provides blockchain explorer links

#### `RoundCreationForm.tsx`
- Form for creating new lottery rounds
- Configures round parameters like start/end times and ticket price

## Hooks

The application uses custom hooks to interact with smart contracts:

- `useLottery`: Hooks for lottery contract interactions
- `useToken`: Hooks for token contract interactions (USDT)

## Blockchain Integration

The application connects to the Sepolia testnet and interacts with:
- Lottery smart contract: Handles rounds, tickets, and prize distribution
- USDT token contract: Handles token transfers and approvals

## UI Components

The application uses shadcn/ui components for a consistent design:
- Cards
- Buttons
- Badges
- Skeletons
- Alerts

## Translations

All UI text has been translated to English, including:
- Component titles and descriptions
- Button labels
- Status messages
- Error notifications
- Transaction status updates

## File Locations

### Main Components
- `/app/components/BuyTicket.tsx`
- `/app/components/MintTokens.tsx`
- `/app/components/UserTickets.tsx`
- `/app/components/LotteryInfo.tsx`

### Lottery Components
- `/app/components/lottery/RoundDetails.tsx`
- `/app/components/lottery/TransactionStatus.tsx`
- `/app/components/lottery/RoundCreationForm.tsx`
- `/app/components/lottery/RoundCard.tsx` 