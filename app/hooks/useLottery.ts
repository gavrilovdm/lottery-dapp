import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { LOTTERY_CONTRACT_ADDRESS, lotteryAbi } from '../contracts';
import { Round } from '../contracts/types';

export function useLatestRoundId() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: lotteryAbi,
    functionName: 'latestRoundId',
  });

  return {
    latestRoundId: data as bigint,
    isLoading,
    error,
    refetch,
  };
}

export function useRound(roundId: bigint | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: lotteryAbi,
    functionName: 'rounds',
    args: roundId ? [roundId] : undefined,
    query: {
      enabled: !!roundId,
    },
  });

  const round = data ? {
    ticketPrice: data[0] as bigint,
    totalPot: data[1] as bigint,
    ticketsSold: data[2] as bigint,
    winnersAmount: Number(data[3]),
    startTimestamp: data[4] as bigint,
    finishTimestamp: data[5] as bigint,
    isFinished: data[6] as boolean
  } as Round : undefined;

  return {
    round,
    isLoading,
    error,
    refetch,
  };
}

export function useBuyTicket() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  const buyTicket = (roundId: bigint) => {
    writeContract({
      address: LOTTERY_CONTRACT_ADDRESS,
      abi: lotteryAbi,
      functionName: 'buyTicket',
      args: [roundId],
    });
  };

  return {
    buyTicket,
    isPending,
    isLoading,
    isSuccess,
    error,
    hash,
  };
}

export function useCreateRound() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createRound = (
    startTimestamp: bigint,
    finishTimestamp: bigint,
    fee: number,
    winnersAmount: number,
    rewardDistribution: bigint[],
    ticketPrice: bigint
  ) => {
    writeContract({
      address: LOTTERY_CONTRACT_ADDRESS,
      abi: lotteryAbi,
      functionName: 'createRound',
      args: [startTimestamp, finishTimestamp, fee, winnersAmount, rewardDistribution, ticketPrice],
    });
  };

  return {
    createRound,
    isPending,
    isLoading,
    isSuccess,
    error,
    hash,
  };
}

export function useFinishRound() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  const finishRound = (roundId: bigint, winners: `0x${string}`[]) => {
    writeContract({
      address: LOTTERY_CONTRACT_ADDRESS,
      abi: lotteryAbi,
      functionName: 'finishRound',
      args: [roundId, winners],
    });
  };

  return {
    finishRound,
    isPending,
    isLoading,
    isSuccess,
    error,
    hash,
  };
} 