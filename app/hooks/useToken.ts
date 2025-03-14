import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { TOKEN_CONTRACT_ADDRESS, LOTTERY_CONTRACT_ADDRESS, tokenAbi } from '../contracts';
import { TokenBalance } from '../contracts/types';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';

export function useTokenBalance() {
  const { address } = useAccount();

  const { data: balance, isLoading: isBalanceLoading, error: balanceError, refetch: refetchBalance } = useReadContract({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: tokenAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: allowance, isLoading: isAllowanceLoading, error: allowanceError, refetch: refetchAllowance } = useReadContract({
    address: TOKEN_CONTRACT_ADDRESS,
    abi: tokenAbi,
    functionName: 'allowance',
    args: address ? [address, LOTTERY_CONTRACT_ADDRESS] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const isLoading = isBalanceLoading || isAllowanceLoading;
  const error = balanceError || allowanceError;

  const tokenBalance: TokenBalance | undefined = balance !== undefined && allowance !== undefined
    ? {
      balance: balance as bigint,
      allowance: allowance as bigint,
    }
    : undefined;

  const refetch = async () => {
    await Promise.all([refetchBalance(), refetchAllowance()]);
  };

  return {
    tokenBalance,
    isLoading,
    error,
    refetch,
  };
}

export function useMintToken() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
  const { address } = useAccount();
  const { refetch: refetchBalance } = useTokenBalance();

  const mintToken = (amount: bigint) => {
    if (!address) return;

    writeContract({
      address: TOKEN_CONTRACT_ADDRESS,
      abi: tokenAbi,
      functionName: 'mint',
      args: [address, amount],
    });
  };

  // Refetch balance when minting is successful
  useEffect(() => {
    if (isSuccess) {
      refetchBalance();
    }
  }, [isSuccess, refetchBalance]);

  return {
    mintToken,
    isPending,
    isLoading,
    isSuccess,
    error,
    hash,
  };
}

export function useApproveToken() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approveToken = (amount: bigint) => {
    writeContract({
      address: TOKEN_CONTRACT_ADDRESS,
      abi: tokenAbi,
      functionName: 'approve',
      args: [LOTTERY_CONTRACT_ADDRESS, amount],
    });
  };

  return {
    approveToken,
    isPending,
    isLoading,
    isSuccess,
    error,
    hash,
  };
} 