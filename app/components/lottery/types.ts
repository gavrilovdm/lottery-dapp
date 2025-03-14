export interface RoundConfig {
  startTimestamp: bigint;
  finishTimestamp: bigint;
  fee: number;
  winnersAmount: number;
  rewardDistribution: bigint[];
  ticketPrice: bigint;
}

export type TransactionStatusType = 'waiting_confirmation' | 'processing' | 'success' | 'error' | null; 