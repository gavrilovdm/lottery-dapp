'use client';

import { useState, useEffect } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { LOTTERY_CONTRACT_ADDRESS, lotteryAbi } from '../contracts';
import { formatEther } from 'viem';
import { UserTicket } from '../contracts/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function UserTickets() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [tickets, setTickets] = useState<UserTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserTickets = async () => {
      if (!address || !publicClient) return;

      setIsLoading(true);
      try {
        // Get all TicketPurchased events for the current user
        const events = await publicClient.getContractEvents({
          address: LOTTERY_CONTRACT_ADDRESS,
          abi: lotteryAbi,
          eventName: 'TicketPurchased',
          args: {
            player: address
          },
          fromBlock: 'earliest'
        });

        // Convert events to tickets
        const userTickets: UserTicket[] = [];

        for (const event of events) {
          if (event.args && 'roundId' in event.args) {
            const block = await publicClient.getBlock({
              blockHash: event.blockHash
            });

            // Get round information
            const roundData = await publicClient.readContract({
              address: LOTTERY_CONTRACT_ADDRESS,
              abi: lotteryAbi,
              functionName: 'rounds',
              args: [event.args.roundId as bigint]
            });

            if (Array.isArray(roundData) && roundData.length > 0) {
              const ticketPrice = roundData[0] as bigint;
              if (ticketPrice !== undefined) {
                userTickets.push({
                  roundId: event.args.roundId as bigint,
                  timestamp: block.timestamp,
                  ticketPrice: ticketPrice
                });
              }
            }
          }
        }

        // Sort tickets by time (newest first)
        userTickets.sort((a, b) => Number(b.timestamp - a.timestamp));

        setTickets(userTickets);
      } catch (error) {
        console.error('Error fetching user tickets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isConnected && address) {
      fetchUserTickets();
    } else {
      setIsLoading(false);
    }
  }, [address, isConnected, publicClient]);

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Tickets</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">Connect your wallet to see your tickets</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Tickets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (tickets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Tickets</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">You don't have any tickets yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Tickets</CardTitle>
        <CardDescription>
          Total tickets: {tickets.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {tickets.map((ticket, index) => (
            <Card key={index}>
              <CardContent className="p-4 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold">Round #{ticket.roundId.toString()}</span>
                  <Badge variant="outline">{formatEther(ticket.ticketPrice)} USDT</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(Number(ticket.timestamp) * 1000).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 