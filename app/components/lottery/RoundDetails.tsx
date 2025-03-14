'use client';

import { Round } from '@/app/contracts/types';
import { Badge } from "@/components/ui/badge";
import { formatEther } from 'viem';
import { RoundCard } from './RoundCard';

interface RoundDetailsProps {
  round: Round;
}

export function RoundDetails({ round }: RoundDetailsProps) {
  const isActive = !round.isFinished &&
    BigInt(Math.floor(Date.now() / 1000)) >= round.startTimestamp &&
    BigInt(Math.floor(Date.now() / 1000)) <= round.finishTimestamp;

  const startDate = new Date(Number(round.startTimestamp) * 1000);
  const endDate = new Date(Number(round.finishTimestamp) * 1000);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RoundCard title="Status">
          <div className="flex items-center">
            <Badge variant={isActive ? "default" : round.isFinished ? "destructive" : "secondary"}>
              {isActive ? 'Active' : round.isFinished ? 'Finished' : 'Waiting'}
            </Badge>
          </div>
        </RoundCard>

        <RoundCard title="Prize pool">
          <p className="text-xl font-bold">{round.totalPot ? formatEther(round.totalPot) : '0'} USDT</p>
        </RoundCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RoundCard title="Ticket price">
          <p className="text-xl font-bold">{round.ticketPrice ? formatEther(round.ticketPrice) : '0'} USDT</p>
        </RoundCard>

        <RoundCard title="Sold tickets">
          <p className="text-xl font-bold">{round.ticketsSold ? round.ticketsSold.toString() : '0'}</p>
        </RoundCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RoundCard title="Start">
          <p>{startDate.toLocaleString()}</p>
        </RoundCard>

        <RoundCard title="End">
          <p>{endDate.toLocaleString()}</p>
        </RoundCard>
      </div>
    </div>
  );
} 