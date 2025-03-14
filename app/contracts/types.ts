export interface Round {
  ticketPrice: bigint;
  totalPot: bigint;
  ticketsSold: bigint;
  winnersAmount: number;
  startTimestamp: bigint;
  finishTimestamp: bigint;
  isFinished: boolean;
}

export interface RoundWithPlayers extends Round {
  players: string[];
  rewardDistribution: bigint[];
}

export interface UserTicket {
  roundId: bigint;
  timestamp: bigint;
  ticketPrice: bigint;
}

export interface TokenBalance {
  balance: bigint;
  allowance: bigint;
}

export interface LotteryEvent {
  type: 'TicketPurchased' | 'RoundCreated' | 'WinnersDeclared';
  roundId: bigint;
  data: {
    player?: string;
    ticketPrice?: bigint;
    winners?: string[];
    rewardDistribution?: bigint[];
  };
  timestamp: bigint;
  transactionHash: string;
}

export type TransactionResponse = {
  hash: string;
  wait: () => Promise<{ status: number }>;
}; 