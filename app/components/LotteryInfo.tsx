'use client';

import { useCreateRound, useLatestRoundId, useRound, useFinishRound } from '../hooks/useLottery';
import { useTransactionStatus } from '../hooks/useTransactionStatus';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect, useCallback } from 'react';
import { RoundCreationForm, RoundDetails, RoundConfig } from './lottery';
import { TransactionStatus } from './ui/TransactionStatus';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Default configuration for a new round
const defaultRoundConfig: RoundConfig = {
  startTimestamp: BigInt(Math.floor(Date.now() / 1000)),
  finishTimestamp: BigInt(Math.floor(Date.now() / 1000) + 360),
  fee: 10, // 10% fee
  winnersAmount: 2,
  rewardDistribution: [70, 30].map(value => BigInt(value)),
  ticketPrice: parseUnits('10', 18), // 10 USDT
}

export function LotteryInfo() {
  // Hooks for contract interaction
  const { createRound, isPending: isPendingCreateRound, isLoading: isLoadingCreateRound,
    isSuccess: isSuccessCreateRound, error: createRoundError, hash: createRoundHash } = useCreateRound();
  const { latestRoundId, isLoading: isLoadingRoundId, refetch: refetchLatestRoundId } = useLatestRoundId();
  const { round, isLoading: isLoadingRound, refetch: refetchRound } = useRound(latestRoundId);
  const { finishRound, isPending: isPendingFinishRound, isLoading: isLoadingFinishRound,
    isSuccess: isSuccessFinishRound, error: finishRoundError, hash: finishRoundHash } = useFinishRound();
  const { isConnected, address } = useAccount();

  // Local state
  const [roundConfig] = useState<RoundConfig>(defaultRoundConfig);

  // Function to refresh round data
  const refreshRoundData = useCallback(async () => {
    await refetchLatestRoundId();
    await refetchRound();
  }, [refetchLatestRoundId, refetchRound]);

  // Use the transaction status hook for create round operation
  const createRoundStatus = useTransactionStatus({
    isPending: isPendingCreateRound,
    isLoading: isLoadingCreateRound,
    isSuccess: isSuccessCreateRound,
    error: createRoundError,
    operation: 'create_round',
    onSuccess: refreshRoundData
  });

  // Use the transaction status hook for finish round operation
  const finishRoundStatus = useTransactionStatus({
    isPending: isPendingFinishRound,
    isLoading: isLoadingFinishRound,
    isSuccess: isSuccessFinishRound,
    error: finishRoundError,
    operation: 'finish_round',
    onSuccess: refreshRoundData
  });

  // Helper method to check if round is finishable
  const isRoundFinishable = useCallback(() => {
    return round && !round.isFinished && !isPendingFinishRound && !isLoadingFinishRound;
  }, [round, isPendingFinishRound, isLoadingFinishRound]);

  // Helper method for getting the title
  const getCardTitle = useCallback(() => {
    if (createRoundStatus.isLoadingAfterTransaction || finishRoundStatus.isLoadingAfterTransaction) {
      return "Loading...";
    }
    if (round && !round.isFinished) {
      return `Round #${latestRoundId?.toString()}`;
    }
    return "Lottery information";
  }, [round, latestRoundId, createRoundStatus.isLoadingAfterTransaction, finishRoundStatus.isLoadingAfterTransaction]);

  // Helper methods for transaction status components
  const getFinishRoundTransactionProps = useCallback(() => {
    return {
      status: finishRoundStatus.transactionStatus,
      hash: finishRoundHash,
      error: finishRoundError,
      operation: finishRoundStatus.currentOperation
    };
  }, [finishRoundStatus.transactionStatus, finishRoundStatus.currentOperation, finishRoundHash, finishRoundError]);

  const getCreateRoundTransactionProps = useCallback(() => {
    return {
      status: createRoundStatus.transactionStatus,
      hash: createRoundHash,
      error: createRoundError,
      operation: createRoundStatus.currentOperation
    };
  }, [createRoundStatus.transactionStatus, createRoundStatus.currentOperation, createRoundHash, createRoundError]);

  const getFinishButtonContent = useCallback(() => {
    if (isPendingFinishRound || isLoadingFinishRound) {
      return (
        <span className="flex items-center">
          <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
          Finishing...
        </span>
      );
    }
    return 'Finish round';
  }, [isPendingFinishRound, isLoadingFinishRound]);

  // Periodically refresh round data
  useEffect(() => {
    if (isConnected) {
      // Initial fetch
      refreshRoundData();

      // Set up interval for periodic refresh (every 10 seconds)
      const intervalId = setInterval(() => {
        refreshRoundData();
      }, 10000);

      // Clean up interval on unmount
      return () => clearInterval(intervalId);
    }
  }, [isConnected, refreshRoundData]);

  // Round creation handler
  const handleCreateRound = () => {
    try {
      createRound(
        roundConfig.startTimestamp,
        roundConfig.finishTimestamp,
        roundConfig.fee,
        roundConfig.winnersAmount,
        roundConfig.rewardDistribution,
        roundConfig.ticketPrice
      );
    } catch (error) {
      console.error('Error creating round:', error);
    }
  }

  // Round finish handler
  const handleFinishRound = () => {
    if (isConnected && address && latestRoundId && round) {
      try {
        // For now, we'll use a simple selection where the first winner is the connected address
        // and the second winner is a zero address (this is just for testing)
        // In a real implementation, you would want to implement proper winner selection logic
        const winners = [
          address,
          '0x71F849019b2FaF88Fb8D86f522C0eE551e6AE84C' as `0x${string}`,
        ];

        finishRound(
          latestRoundId,
          winners
        );
      } catch (error) {
        console.error('Error finishing round:', error);
      }
    }
  }

  // If user is not connected
  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lottery information</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">Connect your wallet to see the current round information</p>
        </CardContent>
      </Card>
    );
  }

  // If data is loading
  if (isLoadingRoundId || isLoadingRound || createRoundStatus.isLoadingAfterTransaction || finishRoundStatus.isLoadingAfterTransaction) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{getCardTitle()}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {getCardTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Show round details if a round exists and is not finished */}
        {round && !round.isFinished ? (
          <>
            <TransactionStatus
              {...getFinishRoundTransactionProps()}
            />
            <RoundDetails
              round={round}
            />
            <Button
              className="w-full"
              disabled={!isRoundFinishable()}
              onClick={handleFinishRound}
            >
              {getFinishButtonContent()}
            </Button>
          </>
        ) : (
          <>
            <TransactionStatus
              {...getCreateRoundTransactionProps()}
            />
            <RoundCreationForm
              roundConfig={roundConfig}
              isCreating={isPendingCreateRound}
              isLoading={isLoadingCreateRound}
              onCreateRound={handleCreateRound}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
} 