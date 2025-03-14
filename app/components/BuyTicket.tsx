'use client';

import { useEffect, useState, useCallback } from 'react';
import { useLatestRoundId, useBuyTicket, useRound } from '../hooks/useLottery';
import { useTokenBalance, useApproveToken } from '../hooks/useToken';
import { useTransactionStatus } from '../hooks/useTransactionStatus';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from 'lucide-react';
import { TransactionStatus, TransactionStatusType, transactionStatusTimeout, OperationType } from './ui/TransactionStatus';

export function BuyTicket() {
  const { isConnected } = useAccount();
  const { latestRoundId } = useLatestRoundId();
  const { round } = useRound(latestRoundId);
  const { tokenBalance } = useTokenBalance();
  const { buyTicket, isPending: isBuyPending, isSuccess: isBuySuccess, error: buyError } = useBuyTicket();
  const { approveToken, isPending: isApprovePending, isSuccess: isApproveSuccess, error: approveError } = useApproveToken();

  // Use the transaction status hook for approve operation
  const approveStatus = useTransactionStatus({
    isPending: isApprovePending,
    isSuccess: isApproveSuccess,
    error: approveError,
    operation: 'approve'
  });

  // Use the transaction status hook for buy ticket operation
  const buyStatus = useTransactionStatus({
    isPending: isBuyPending,
    isSuccess: isBuySuccess,
    error: buyError,
    operation: 'buy_ticket'
  });

  // Determine the current transaction state to display
  const currentTransactionStatus = buyStatus.transactionStatus || approveStatus.transactionStatus;
  const currentOperation = buyStatus.transactionStatus ? buyStatus.currentOperation : approveStatus.currentOperation;

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Buy Ticket</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">Connect your wallet to buy a ticket</p>
        </CardContent>
      </Card>
    );
  }

  if (!round) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Buy Ticket</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">Loading information...</p>
        </CardContent>
      </Card>
    );
  }

  const isActive = !round.isFinished
    && BigInt(Math.floor(Date.now() / 1000)) >= round.startTimestamp
    && BigInt(Math.floor(Date.now() / 1000)) <= round.finishTimestamp;

  const isEnded = BigInt(Math.floor(Date.now() / 1000)) >= round.finishTimestamp;

  const handleApprove = () => {
    if (!round) return;
    approveToken(round.ticketPrice);
  };

  const handleBuyTicket = () => {
    if (!round || !latestRoundId) return;
    buyTicket(latestRoundId);
  };

  const hasEnoughBalance = tokenBalance && tokenBalance.balance >= round.ticketPrice;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buy Ticket</CardTitle>
        <CardDescription>
          Ticket price: {round.ticketPrice ? formatEther(round.ticketPrice) : '...'} USDT
        </CardDescription>
        <TransactionStatus
          status={currentTransactionStatus}
          operation={currentOperation}
          error={currentOperation === 'approve' ? approveError : (currentOperation === 'buy_ticket' ? buyError : undefined)}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        {!isActive && (
          <div className="mb-4">
            <Badge variant="destructive" className="mb-2">
              Lottery is {isEnded ? 'ended' : 'not active'}
            </Badge>
            <p className="text-muted-foreground">You cannot buy a ticket at the moment</p>
          </div>
        )}

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm">Your balance:</span>
            <span>{tokenBalance ? formatEther(tokenBalance.balance) : '...'} USDT</span>
          </div>

          {tokenBalance && !hasEnoughBalance && (
            <p className="text-destructive text-sm mb-2">
              You don&apos;t have enough USDT to buy a ticket.
              <p>Don&apos;t have enough tokens?</p>
              <p>Click &quot;Mint Tokens&quot; to get some!</p>
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button
          className="w-full"
          variant="outline"
          disabled={!isActive || !round || !tokenBalance || !hasEnoughBalance || isApprovePending}
          onClick={handleApprove}
        >
          {isApprovePending ? (
            <span className="flex items-center">
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Approving...
            </span>
          ) : 'Approve USDT'}
        </Button>

        <Button
          className="w-full"
          disabled={!isActive || !round || !tokenBalance || !hasEnoughBalance || isBuyPending || !isApproveSuccess}
          onClick={handleBuyTicket}
        >
          {isBuyPending ? (
            <span className="flex items-center">
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Buying...
            </span>
          ) : 'Buy Ticket'}
        </Button>
      </CardFooter>
    </Card>
  );
} 