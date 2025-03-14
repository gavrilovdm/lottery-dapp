'use client';

import { useState } from 'react';
import { useTokenBalance, useMintToken } from '../hooks/useToken';
import { formatEther, parseEther } from 'viem';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from 'lucide-react';
import { TransactionStatus } from './ui/TransactionStatus';

export function MintTokens() {
  const { isConnected } = useAccount();
  const { tokenBalance, isLoading: isLoadingBalance } = useTokenBalance();
  const { mintToken, isPending, isSuccess, error: mintError } = useMintToken();

  const [amount, setAmount] = useState('100');

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Get USDT</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">Connect your wallet to get test USDT</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoadingBalance || !tokenBalance) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Get USDT</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const handleMint = () => {
    try {
      const amountInWei = parseEther(amount);
      mintToken(amountInWei);
    } catch (error) {
      console.error('Error parsing amount:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Get USDT</CardTitle>
        <CardDescription>
          Get test USDT for use in the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm">Your current balance:</span>
            <span>{tokenBalance ? formatEther(tokenBalance.balance) : '...'} USDT</span>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium mb-2">
            Amount (USDT)
          </label>
          <Input
            id="amount"
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter USDT amount"
            className="w-full"
          />
        </div>

        <TransactionStatus
          status={isPending ? 'processing' : (isSuccess ? 'success' : (mintError ? 'error' : null))}
          operation="mint"
          error={mintError}
        />
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleMint}
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center">
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Getting...
            </span>
          ) : 'Get USDT'}
        </Button>
      </CardFooter>
    </Card>
  );
} 