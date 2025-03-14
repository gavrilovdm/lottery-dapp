'use client';

import { useEffect, useState } from 'react';
import { useLatestRoundId, useBuyTicket, useRound } from '../hooks/useLottery';
import { useTokenBalance, useApproveToken } from '../hooks/useToken';
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
  const { tokenBalance, isLoading: isLoadingBalance } = useTokenBalance();
  const { buyTicket, isPending: isBuyPending, isSuccess: isBuySuccess, error: buyError } = useBuyTicket();
  const { approveToken, isPending: isApprovePending, isSuccess: isApproveSuccess, error: approveError } = useApproveToken();

  const [showApproveSuccess, setShowApproveSuccess] = useState(false);
  const [showBuySuccess, setShowBuySuccess] = useState(false);

  const [transactionStatus, setTransactionStatus] = useState<TransactionStatusType | null>(null);
  const [currentOperation, setCurrentOperation] = useState<OperationType>('default');

  useEffect(() => {
    if (isApprovePending) {
      setTransactionStatus('waiting_confirmation');
      setCurrentOperation('approve');
    } else if (isApproveSuccess) {
      setTransactionStatus('success');
      setCurrentOperation('approve');
      const timer = setTimeout(() => {
        setTransactionStatus(null);
        setCurrentOperation('default');
      }, transactionStatusTimeout);
      return () => clearTimeout(timer);
    } else if (approveError) {
      setTransactionStatus('error');
      setCurrentOperation('approve');
      const timer = setTimeout(() => {
        setTransactionStatus(null);
        setCurrentOperation('default');
      }, transactionStatusTimeout);
      return () => clearTimeout(timer);
    }
  }, [isApprovePending, isApproveSuccess, approveError]);

  useEffect(() => {
    if (isBuyPending) {
      setTransactionStatus('waiting_confirmation');
      setCurrentOperation('buy_ticket');
    } else if (isBuySuccess) {
      setTransactionStatus('success');
      setCurrentOperation('buy_ticket');
      const timer = setTimeout(() => {
        setTransactionStatus(null);
        setCurrentOperation('default');
      }, transactionStatusTimeout);
      return () => clearTimeout(timer);
    } else if (buyError) {
      setTransactionStatus('error');
      setCurrentOperation('buy_ticket');
      const timer = setTimeout(() => {
        setTransactionStatus(null);
        setCurrentOperation('default');
      }, transactionStatusTimeout);
      return () => clearTimeout(timer);
    }
  }, [isBuyPending, isBuySuccess, buyError]);

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
    setShowApproveSuccess(true);
  };

  const handleBuyTicket = () => {
    if (!round || !latestRoundId) return;
    buyTicket(latestRoundId);
    setShowBuySuccess(true);
  };

  const hasEnoughBalance = tokenBalance && tokenBalance.balance >= round.ticketPrice;
  const hasEnoughAllowance = tokenBalance && tokenBalance.allowance >= round.ticketPrice;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buy Ticket</CardTitle>
        <CardDescription>
          Ticket price: {round.ticketPrice ? formatEther(round.ticketPrice) : '...'} USDT
        </CardDescription>
        <TransactionStatus
          status={transactionStatus}
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
              You don't have enough USDT to buy a ticket.
              Get test tokens on the "Get USDT" tab
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