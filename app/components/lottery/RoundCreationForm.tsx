'use client';

import { Button } from '@/components/ui/button';
import { formatEther } from 'viem';
import { Loader2 } from "lucide-react";

interface RoundConfig {
  startTimestamp: bigint;
  finishTimestamp: bigint;
  fee: number;
  winnersAmount: number;
  rewardDistribution: bigint[];
  ticketPrice: bigint;
}

interface RoundCreationFormProps {
  roundConfig: RoundConfig;
  isCreating: boolean;
  isLoading: boolean;
  onCreateRound: () => void;
}

export function RoundCreationForm({
  roundConfig,
  isCreating,
  isLoading,
  onCreateRound
}: RoundCreationFormProps) {
  return (
    <div className="text-center">
      <p className="text-muted-foreground mb-4">No active rounds</p>
      <div className="mb-4 border rounded-lg p-4 bg-muted/40">
        <p className="text-sm font-medium mb-2">New round parameters:</p>
        <ul className="text-xs text-left bg-muted p-3 rounded-md mb-4">
          <li className="mb-1">
            <span className="font-medium">Start:</span> {new Date(Number(roundConfig.startTimestamp) * 1000).toLocaleString()}
          </li>
          <li className="mb-1">
            <span className="font-medium">Finish:</span> {new Date(Number(roundConfig.finishTimestamp) * 1000).toLocaleString()}
          </li>
          <li className="mb-1">
            <span className="font-medium">Fee:</span> {roundConfig.fee}%
          </li>
          <li className="mb-1">
            <span className="font-medium">Winners:</span> {roundConfig.winnersAmount}
          </li>
          <li className="mb-1">
            <span className="font-medium">Reward distribution:</span> {roundConfig.rewardDistribution.map(x => Number(x)).join('%, ')}%
          </li>
          <li className="mb-1">
            <span className="font-medium">Ticket price:</span> {formatEther(roundConfig.ticketPrice)} USDT
          </li>
        </ul>
      </div>
      <Button
        onClick={onCreateRound}
        disabled={isCreating || isLoading}
        className="w-full"
      >
        {(isCreating || isLoading) ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isCreating ? 'Waiting for confirmation...' : 'Creating round...'}
          </>
        ) : 'Create Round'}
      </Button>
    </div>
  );
} 